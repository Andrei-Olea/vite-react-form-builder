import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Development mode info
if (import.meta.env.DEV) {
  console.log(
    '%c🚀 Development Mode',
    'background: #005953; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 14px;'
  );
  console.log('  ⚠️  Backend PHP submission: Requires DDEV/PHP server running');
  console.log('');
  console.log(
    '%c💡 To enable full backend support (emails & logging):',
    'color: #0066cc; font-weight: bold;'
  );
  console.log('  Run: cd .. && ddev start');
  console.log('  Or start your PHP server if not using DDEV');
  console.log('');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
