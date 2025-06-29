// Google Analytics utility for HonestBox
// Privacy-focused analytics implementation

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Analytics configuration
const ANALYTICS_CONFIG = {
  // Replace with your actual Google Analytics measurement ID
  MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-9JJDYZ5G68',
  // Enable analytics only in production or when explicitly enabled
  ENABLED: import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  // Privacy settings
  // ANONYMIZE_IP: true,
  // ALLOW_GOOGLE_SIGNALS: false,
  // ALLOW_AD_PERSONALIZATION: false,
};

// Event types for type safety
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Common event categories
export const EVENT_CATEGORIES = {
  USER_ENGAGEMENT: 'User Engagement',
  FEEDBACK: 'Feedback',
  AUTHENTICATION: 'Authentication',
  NAVIGATION: 'Navigation',
  ERROR: 'Error',
  SHARING: 'Sharing',
} as const;

// Common event actions
export const EVENT_ACTIONS = {
  // Authentication events
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  LOGOUT: 'logout',
  GOOGLE_SIGN_IN: 'google_sign_in',
  PASSWORD_RESET: 'password_reset',

  // Feedback events
  FEEDBACK_SENT: 'feedback_sent',
  FEEDBACK_REQUEST_CREATED: 'feedback_request_created',
  FEEDBACK_REQUEST_SHARED: 'feedback_request_shared',
  FEEDBACK_REQUEST_VIEWED: 'feedback_request_viewed',

  // Navigation events
  PAGE_VIEW: 'page_view',
  EXTERNAL_LINK_CLICK: 'external_link_click',

  // User engagement
  PWA_INSTALL_PROMPT: 'pwa_install_prompt',

  // Sharing events
  INSTAGRAM_SHARE: 'instagram_share',
  SOCIAL_SHARE: 'social_share',

  // Error events
  ERROR_OCCURRED: 'error_occurred',
} as const;

// Initialize analytics
export const initializeAnalytics = (): void => {
  // if (!ANALYTICS_CONFIG.ENABLED) {
  //   console.log('Analytics disabled in development mode');
  //   return;
  // }

  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics not loaded');
    return;
  }

  // Configure Google Analytics with privacy settings
  window.gtag('config', ANALYTICS_CONFIG.MEASUREMENT_ID, {
    // anonymize_ip: ANALYTICS_CONFIG.ANONYMIZE_IP,
    // allow_google_signals: ANALYTICS_CONFIG.ALLOW_GOOGLE_SIGNALS,
    // allow_ad_personalization_signals: ANALYTICS_CONFIG.ALLOW_AD_PERSONALIZATION,
    cookie_flags: 'secure;samesite=strict',
    page_title: document.title,
    page_location: window.location.href,
  });

  console.log('Google Analytics initialized');
};

// Track page views
export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  if (!ANALYTICS_CONFIG.ENABLED || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', ANALYTICS_CONFIG.MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
};

// Track custom events
export const trackEvent = (event: AnalyticsEvent): void => {
  if (!ANALYTICS_CONFIG.ENABLED || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  const eventData: any = {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.custom_parameters,
  };

  // Remove undefined values
  Object.keys(eventData).forEach(key => {
    if (eventData[key] === undefined) {
      delete eventData[key];
    }
  });

  window.gtag('event', event.action, eventData);
};

// Convenience functions for common events

export const trackUserSignUp = (method: 'email' | 'google' = 'email'): void => {
  trackEvent({
    action: EVENT_ACTIONS.SIGN_UP,
    category: EVENT_CATEGORIES.AUTHENTICATION,
    label: method,
    custom_parameters: {
      method,
    },
  });
};

export const trackUserLogin = (method: 'email' | 'google' = 'email'): void => {
  trackEvent({
    action: EVENT_ACTIONS.LOGIN,
    category: EVENT_CATEGORIES.AUTHENTICATION,
    label: method,
    custom_parameters: {
      method,
    },
  });
};

export const trackFeedbackSent = (feedbackRequestId?: string): void => {
  trackEvent({
    action: EVENT_ACTIONS.FEEDBACK_SENT,
    category: EVENT_CATEGORIES.FEEDBACK,
    custom_parameters: {
      feedback_request_id: feedbackRequestId,
    },
  });
};

export const trackFeedbackRequestCreated = (): void => {
  trackEvent({
    action: EVENT_ACTIONS.FEEDBACK_REQUEST_CREATED,
    category: EVENT_CATEGORIES.FEEDBACK,
  });
};

export const trackFeedbackRequestShared = (method: 'instagram' | 'copy_link' | 'social'): void => {
  trackEvent({
    action: EVENT_ACTIONS.FEEDBACK_REQUEST_SHARED,
    category: EVENT_CATEGORIES.SHARING,
    label: method,
    custom_parameters: {
      method,
    },
  });
};

export const trackError = (errorMessage: string, errorContext?: string): void => {
  trackEvent({
    action: EVENT_ACTIONS.ERROR_OCCURRED,
    category: EVENT_CATEGORIES.ERROR,
    label: errorMessage,
    custom_parameters: {
      error_message: errorMessage,
      error_context: errorContext,
    },
  });
};

// Export analytics configuration for debugging
export const getAnalyticsConfig = () => ANALYTICS_CONFIG; 
