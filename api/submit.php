<?php
/**
 * Form Submission Handler
 * Handles form submissions with optional email notifications
 * Configuration loaded from .env file
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', '0'); // Don't display to browser
ini_set('log_errors', '1');

// Set JSON response header early
header('Content-Type: application/json');

// Global error handler to catch fatal errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Server error',
            'debug' => [
                'error' => $error['message'],
                'file' => $error['file'],
                'line' => $error['line']
            ]
        ]);
    }
});

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Load Composer autoloader with error handling
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Configuration error: Composer dependencies not found',
        'debug' => [
            'expected_path' => $autoloadPath,
            'current_dir' => __DIR__,
            'help' => 'Run "composer install" or ensure vendor/ directory is uploaded'
        ]
    ]);
    exit;
}
require $autoloadPath;

// Load environment variables from .env file
// Try multiple locations for flexibility (production outside webroot, dev inside)
$envPaths = [
    __DIR__ . '/../../../..',  // Production: four levels up (parent-directory)
    __DIR__ . '/../../..',     // Production: three levels up ([app-root])
    __DIR__ . '/../..',        // Production: two levels up (vinculacion folder)
    __DIR__ . '/..',           // Development: one level up from api (project root)
];

$dotenv = null;
$checkedPaths = [];
foreach ($envPaths as $envPath) {
    // Resolve the path to absolute
    $resolvedPath = realpath($envPath);

    if ($resolvedPath) {
        $envFilePath = $resolvedPath . '/.env';
        $checkedPaths[] = [
            'relative' => $envPath,
            'resolved' => $resolvedPath,
            'env_file' => $envFilePath,
            'exists' => file_exists($envFilePath),
            'readable' => file_exists($envFilePath) && is_readable($envFilePath)
        ];

        if (file_exists($envFilePath) && is_readable($envFilePath)) {
            $dotenv = Dotenv\Dotenv::createImmutable($resolvedPath);
            break;
        }
    } else {
        $checkedPaths[] = [
            'relative' => $envPath,
            'resolved' => null,
            'error' => 'Path does not exist'
        ];
    }
}

if (!$dotenv) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Configuration error: .env file not found',
        'debug' => [
            '__DIR__' => __DIR__,
            'checked_paths' => $checkedPaths,
            'help' => 'Ensure .env file exists and is readable by the web server'
        ]
    ]);
    exit;
}

$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// CORS headers
$allowedOrigins = $_ENV['APP_ALLOWED_ORIGINS'] ?? '*';
if ($allowedOrigins === '*') {
    header('Access-Control-Allow-Origin: *');
} else {
    $origins = explode(',', $allowedOrigins);
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
$requiredFields = [
    'nombre_completo',
    'documento_identidad',
    'ciudad',
    'email',
    'meta_anual_ahorro',
    'frecuencia_ahorro',
    'modalidad_ahorro',
];

$errors = [];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $errors[] = "El campo {$field} es requerido";
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Datos incompletos',
        'errors' => $errors
    ]);
    exit;
}

// Sanitize data
$sanitizedData = [
    'nombre_completo' => htmlspecialchars(trim($data['nombre_completo'])),
    'documento_identidad' => htmlspecialchars(trim($data['documento_identidad'])),
    'ciudad' => htmlspecialchars(trim($data['ciudad'])),
    'email' => filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL),
    'meta_anual_ahorro' => floatval($data['meta_anual_ahorro']),
    'frecuencia_ahorro' => htmlspecialchars(trim($data['frecuencia_ahorro'])),
    'numero_cuotas' => isset($data['numero_cuotas']) ? intval($data['numero_cuotas']) : null,
    'valor_cuota_mensual' => isset($data['valor_cuota_mensual']) ? floatval($data['valor_cuota_mensual']) : 0,
    'valor_cuota_semestral' => isset($data['valor_cuota_semestral']) ? floatval($data['valor_cuota_semestral']) : 0,
    'modalidad_ahorro' => htmlspecialchars(trim($data['modalidad_ahorro'])),
    'ipaddress' => isset($data['ipaddress']) ? htmlspecialchars(trim($data['ipaddress'])) : '',
    'timestamp' => isset($data['timestamp']) ? htmlspecialchars(trim($data['timestamp'])) : date('Y-m-d H:i:s'),
];

// Validate email
if (!filter_var($sanitizedData['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Correo electrónico inválido'
    ]);
    exit;
}

// Log submission if enabled
$logSubmissions = filter_var($_ENV['APP_LOG_SUBMISSIONS'] ?? 'true', FILTER_VALIDATE_BOOLEAN);
if ($logSubmissions) {
    $logFile = $_ENV['APP_LOG_FILE'] ?? 'submissions.log';
    $logEntry = date('Y-m-d H:i:s') . ' - ' . json_encode($sanitizedData) . PHP_EOL;
    file_put_contents(__DIR__ . '/' . $logFile, $logEntry, FILE_APPEND);
}

// Send email if enabled
$emailSent = false;
$emailError = null;
$emailEnabled = filter_var($_ENV['EMAIL_ENABLED'] ?? 'true', FILTER_VALIDATE_BOOLEAN);

if ($emailEnabled) {
    try {
        $mail = new PHPMailer(true);

        // SMTP Configuration from .env
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'] ?? 'localhost';
        $mail->Port = intval($_ENV['SMTP_PORT'] ?? 587);
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = $_ENV['SMTP_SECURE'] ?? 'tls';
        $mail->Username = $_ENV['SMTP_USERNAME'] ?? '';
        $mail->Password = $_ENV['SMTP_PASSWORD'] ?? '';

        // Email settings from .env
        $mail->setFrom(
            $_ENV['EMAIL_FROM_ADDRESS'] ?? 'noreply@example.com',
            $_ENV['EMAIL_FROM_NAME'] ?? 'Codecol'
        );
        $mail->addAddress($sanitizedData['email']);

        // BCC from .env
        $bccAddresses = $_ENV['EMAIL_BCC_ADDRESSES'] ?? '';
        if (!empty($bccAddresses)) {
            $bccList = explode(',', $bccAddresses);
            foreach ($bccList as $bcc) {
                $mail->addBCC(trim($bcc));
            }
        }

        // Content
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        $mail->Subject = $_ENV['EMAIL_SUBJECT'] ?? 'Programa de Ahorro';

        // Build email body
        $mail->Body = buildEmailBody($sanitizedData);
        $mail->AltBody = buildTextEmailBody($sanitizedData);

        $mail->send();
        $emailSent = true;
    } catch (Exception $e) {
        $emailError = $e->getMessage();
        error_log('Email error: ' . $emailError);
    }
}

// Send response
$response = [
    'success' => true,
    'message' => 'Formulario recibido exitosamente',
    'data' => [
        'email_sent' => $emailSent,
        'email_enabled' => $emailEnabled,
    ]
];

if (!$emailSent && $emailEnabled) {
    $response['warning'] = 'El formulario fue recibido pero el correo no pudo ser enviado';
    if ($emailError) {
        $response['email_error'] = $emailError;
    }
}

echo json_encode($response);

/**
 * Build HTML email body
 */
function buildEmailBody($data) {
    $metaFormat = number_format($data['meta_anual_ahorro'], 0, ',', '.');
    $cuotaMensual = $data['valor_cuota_mensual'] > 0 ? number_format($data['valor_cuota_mensual'], 0, ',', '.') : 'N/A';
    $cuotaSemestral = $data['valor_cuota_semestral'] > 0 ? number_format($data['valor_cuota_semestral'], 0, ',', '.') : 'N/A';

    return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <h2 style='color: #1e40af;'>¡Hola {$data['nombre_completo']}!</h2>
            <p>Hemos recibido tu solicitud de vinculación al <strong>Programa de Ahorro + Bono de Bienestar Navideño 2025</strong>.</p>

            <div style='background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;'>
                <h3 style='margin-top: 0;'>Resumen de tu solicitud:</h3>
                <p><strong>Documento:</strong> {$data['documento_identidad']}</p>
                <p><strong>Ciudad:</strong> {$data['ciudad']}</p>
                <p><strong>Meta anual de ahorro:</strong> \${$metaFormat}</p>
                <p><strong>Frecuencia:</strong> {$data['frecuencia_ahorro']}</p>
                <p><strong>Valor cuota mensual:</strong> \${$cuotaMensual}</p>
                <p><strong>Valor cuota semestral:</strong> \${$cuotaSemestral}</p>
                <p><strong>Modalidad:</strong> {$data['modalidad_ahorro']}</p>
            </div>

            <p>Pronto estaremos en contacto contigo para continuar con el proceso.</p>
            <p style='color: #6b7280;'>Gracias por confiar en nosotros.</p>
            <p><strong>Codecol</strong></p>
        </div>
    ";
}

/**
 * Build plain text email body
 */
function buildTextEmailBody($data) {
    $metaFormat = number_format($data['meta_anual_ahorro'], 0, ',', '.');

    return "
        ¡Hola {$data['nombre_completo']}!

        Hemos recibido tu solicitud de vinculación al Programa de Ahorro + Bono de Bienestar Navideño 2025.

        Meta anual de ahorro: \${$metaFormat}
        Frecuencia: {$data['frecuencia_ahorro']}
        Modalidad: {$data['modalidad_ahorro']}

        Pronto estaremos en contacto contigo.

        Gracias por confiar en nosotros.
        Codecol
    ";
}
