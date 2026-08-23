export async function initPushServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.register('/push-sw.js', { scope: '/' });
  } catch (error) {
    console.error('Push service worker registration failed:', error);
    return null;
  }
}
