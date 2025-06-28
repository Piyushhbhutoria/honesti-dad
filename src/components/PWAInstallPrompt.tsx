import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if PWA is already installed
  const isPWAInstalled = () => {
    // Check if running in standalone mode (PWA is installed)
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }

    // Check for navigator.standalone (iOS Safari)
    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      return true;
    }

    // Check if launched from home screen
    if (document.referrer.includes('android-app://')) {
      return true;
    }

    return false;
  };

  // Start the auto-hide timer
  const startHideTimer = () => {
    clearHideTimer();
    hideTimeoutRef.current = setTimeout(() => {
      console.log('PWA install prompt auto-hidden after 15 seconds of inactivity');
      setShowPrompt(false);
      setDeferredPrompt(null);
    }, 15000); // 15 seconds
  };

  // Clear the auto-hide timer
  const clearHideTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Reset the timer when user interacts with the banner
  const resetHideTimer = () => {
    startHideTimer();
  };

  useEffect(() => {
    // Don't show prompt if PWA is already installed
    if (isPWAInstalled()) {
      console.log('PWA is already installed, not showing install prompt');
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
      clearHideTimer();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearHideTimer();
    };
  }, []);

  // Start timer when prompt becomes visible
  useEffect(() => {
    if (showPrompt && !isPWAInstalled()) {
      startHideTimer();
    } else {
      clearHideTimer();
    }

    return () => {
      clearHideTimer();
    };
  }, [showPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    clearHideTimer(); // Stop auto-hide during installation
    setIsInstalling(true);

    try {
      // Show the install prompt
      const result = await deferredPrompt.prompt();
      console.log('Install prompt shown, result:', result);

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log('User choice:', outcome);

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    clearHideTimer();
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt || isPWAInstalled()) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 glass shadow-glass border-0 rounded-lg p-4 z-50 md:left-auto md:right-4 md:max-w-sm transition-colors duration-300 ease-in-out"
      onMouseEnter={resetHideTimer}
      onMouseLeave={resetHideTimer}
      onTouchStart={resetHideTimer}
      onFocus={resetHideTimer}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="glass-card bg-gradient-to-br from-primary to-primary/80 p-2 shadow-glass">
            <Download className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-foreground">Install HonestBox</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0 hover:bg-primary/10 focus-ring transition-colors duration-300"
          disabled={isInstalling}
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Install our app for a better experience and quick access to anonymous feedback.
      </p>
      <Button
        onClick={handleInstall}
        disabled={isInstalling}
        variant="gradient-primary"
        className="w-full transition-all duration-300 transform hover:scale-105"
      >
        {isInstalling ? 'Installing...' : 'Install App'}
      </Button>
    </div>
  );
};

export default PWAInstallPrompt;
