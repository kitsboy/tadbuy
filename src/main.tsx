import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './lib/i18n';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry.ts';

initSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
