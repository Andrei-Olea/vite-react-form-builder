<?php
/**
 * Main entry point for DDEV access
 *
 * This file serves the built application from dist/ directory
 * For development, use: pnpm dev (http://localhost:3000)
 */

// Check if dist/index.html exists (production build)
$distIndex = __DIR__ . '/dist/index.html';

if (file_exists($distIndex)) {
    // Serve the built application
    readfile($distIndex);
} else {
    // No build available - show development instructions
    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Codecol - Programa de Ahorro 2025 - Desarrollo</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                max-width: 800px;
                margin: 100px auto;
                padding: 20px;
                background: #f5f5f5;
            }
            .card {
                background: white;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #2c3e50; margin-top: 0; }
            .info { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .warning { background: #fff3e0; padding: 15px; border-radius: 4px; margin: 20px 0; }
            code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: 'Monaco', 'Courier New', monospace; }
            a { color: #1976d2; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>⚙️ Modo Desarrollo</h1>

            <div class="warning">
                <strong>⚠️ No se encontró la versión compilada</strong>
                <p>El directorio <code>dist/</code> no existe o está vacío.</p>
            </div>

            <div class="info">
                <h2>Para desarrollo local:</h2>
                <ol>
                    <li>Ejecuta: <code>pnpm dev</code></li>
                    <li>Abre: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></li>
                </ol>
            </div>

            <div class="info">
                <h2>Para acceder vía DDEV:</h2>
                <ol>
                    <li>Ejecuta: <code>pnpm build</code></li>
                    <li>Recarga esta página</li>
                </ol>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

            <p><small>📍 Ubicación: <code><?php echo __DIR__; ?></code></small></p>
        </div>
    </body>
    </html>
    <?php
}
