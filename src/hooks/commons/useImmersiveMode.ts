import { useCallback, useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';

/**
 * Auto-hides the Android system navigation bar (3-button / gesture bar)
 * after a specified delay using sticky immersive mode.
 *
 * In sticky immersive mode, a swipe from the bottom edge temporarily
 * reveals the navigation bar, then the OS auto-hides it again.
 *
 * No-op on iOS.
 *
 * @param enabled - Whether immersive mode should be active (default: true)
 * @param delayMs - Delay before hiding the nav bar in milliseconds (default: 2000)
 */
export const useImmersiveMode = (enabled: boolean = true, delayMs: number = 2000) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideNavBar = useCallback(() => {
    if (Platform.OS !== 'android') return;
    try {
      SystemNavigationBar.stickyImmersive();
    } catch (e) {
      console.warn('[useImmersiveMode] Failed to enable sticky immersive mode:', e);
    }
  }, []);

  const showNavBar = useCallback(() => {
    if (Platform.OS !== 'android') return;
    try {
      SystemNavigationBar.navigationShow();
    } catch (e) {
      console.warn('[useImmersiveMode] Failed to show navigation bar:', e);
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      hideNavBar();
    }, delayMs);
  }, [clearTimer, hideNavBar, delayMs]);

  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') return;

    // Show nav bar initially, then schedule auto-hide
    showNavBar();
    scheduleHide();

    // Re-apply immersive mode when app returns from background
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && enabled) {
        scheduleHide();
      }
    });

    return () => {
      clearTimer();
      showNavBar(); // Restore nav bar when leaving dashboard
      subscription.remove();
    };
  }, [enabled, showNavBar, scheduleHide, clearTimer]);

  return { hideNavBar, showNavBar, scheduleHide };
};

export default useImmersiveMode;
