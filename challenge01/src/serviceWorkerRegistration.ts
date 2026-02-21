export function register(config?: { onSuccess?: (reg: ServiceWorkerRegistration) => void }) {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    const swUrl = '/service-worker.js';
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('Service worker registered:', registration.scope);
        if (config && config.onSuccess) config.onSuccess(registration);
      })
      .catch((err) => console.error('Service worker registration failed:', err));
  });
}

export function unregister() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready
    .then((registration) => registration.unregister())
    .catch((err) => console.error(err));
}
