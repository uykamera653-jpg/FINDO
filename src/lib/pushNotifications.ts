import { supabase } from '@/lib/supabase';

export type PushRegistrationResult = {
  token: string | null;
  supported: boolean;
};

/**
 * Registers a browser push token when the runtime provides a Web Push API.
 * The current FINDO web app is not an Expo/React-Native runtime, so we keep
 * this integration capability-safe and persist tokens only when the browser
 * exposes the required API and the user is authenticated.
 */
export async function registerPushToken(userId: string): Promise<PushRegistrationResult> {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return { token: null, supported: false };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return { token: null, supported: true };

    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    const subscription = existing ?? await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY,
    });

    const token = JSON.stringify(subscription.toJSON());
    const { error } = await supabase.from('push_tokens').upsert(
      {
        user_id: userId,
        token,
        platform: 'web',
      },
      { onConflict: 'user_id,token' }
    );

    if (error) throw error;
    return { token, supported: true };
  } catch (error) {
    console.error('Push registration failed:', error);
    return { token: null, supported: true };
  }
}

export async function saveNotification(userId: string, title: string, body: string, data: Record<string, unknown> = {}) {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title,
    body,
    data,
  });
  if (error) throw error;
}
