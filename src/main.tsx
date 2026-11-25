import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Register Service Worker so all app resources & covers precache automatically for offline use
if (typeof window !== 'undefined' && window.location.protocol !== 'file:') {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.log('Claichy está pre-cargado y listo para funcionar sin conexión.');
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
