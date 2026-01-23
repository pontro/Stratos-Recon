/**
 * Platform Detection Utility
 * Detects whether the PWA is running on Android or iOS
 */

export type Platform = 'android' | 'ios' | 'unknown';

/**
 * Detects the current platform based on user agent and display mode
 * @returns 'android' | 'ios' | 'unknown'
 */
export const detectPlatform = (): Platform => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check for Android
    if (/android/.test(userAgent)) {
        return 'android';
    }

    // Check for iOS (iPhone, iPad, iPod)
    if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'ios';
    }

    // Additional check for iOS in standalone mode (PWA)
    // iOS Safari hides the user agent in some PWA contexts
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (navigator as any).standalone === true;

    if (isIOSStandalone || (isStandalone && /safari/.test(userAgent))) {
        return 'ios';
    }

    return 'unknown';
};
