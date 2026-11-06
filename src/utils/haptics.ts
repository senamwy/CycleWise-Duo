/**
 * Haptic feedback helper for mobile devices using the HTML5 Vibration API.
 * Gracefully degrades if unsupported or disabled.
 */
export type HapticType = 'light' | 'medium' | 'heavy' | 'success';

export function triggerHapticFeedback(type: HapticType = 'light'): void {
  if (typeof window === 'undefined' || !navigator || !navigator.vibrate) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(25);
        break;
      case 'medium':
        navigator.vibrate(50);
        break;
      case 'heavy':
        navigator.vibrate(90);
        break;
      case 'success':
        navigator.vibrate([30, 40, 60]);
        break;
      default:
        navigator.vibrate(25);
    }
  } catch (err) {
    // Ignore vibration restrictions or errors on unsupported browsers
    console.debug('Haptic feedback not supported or blocked:', err);
  }
}
