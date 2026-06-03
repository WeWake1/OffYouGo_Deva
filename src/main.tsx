import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import content from './config/content';
import { fill } from './lib/text';
import './index.css';

// A small hello for the fellow dev who cracks open devtools.
console.log(
  `%c✦ ${fill(content.consoleMessage, content)}`,
  'color:#f7ab4d;font-family:monospace;font-size:13px;',
);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found in index.html');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
