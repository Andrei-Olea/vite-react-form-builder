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
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ViteJs + React Form Starter</title>
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
            <h1>⚙️ Development Mode</h1>

            <div class="warning">
                <strong>⚠️ Built version not found</strong>
                <p>The <code>dist/</code> directory does not exist or is empty.</p>
            </div>

            <div class="info">
                <h2>For local development:</h2>
                <ol>
                    <li>Run: <code>pnpm dev</code></li>
                    <li>Open: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></li>
                </ol>
            </div>

            <div class="info">
                <h2>To access via DDEV:</h2>
                <ol>
                    <li>Run: <code>pnpm build</code></li>
                    <li>Reload this page</li>
                </ol>
            </div>

        </div>
    </body>
    </html>
    <?php
}
