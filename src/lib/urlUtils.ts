// Secure URL utilities to prevent open redirect attacks

// Define allowed origins for production and development
const ALLOWED_ORIGINS = {
  production: ['https://honesti-dad.lovable.app'], // Replace with your actual production domain
  development: [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
  ]
};

// Get the current environment
const isDevelopment = import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';

// Get allowed origins for current environment
const getAllowedOrigins = (): string[] => {
  return isDevelopment
    ? [...ALLOWED_ORIGINS.development, ...ALLOWED_ORIGINS.production]
    : ALLOWED_ORIGINS.production;
};

// Validate if an origin is allowed
export const isOriginAllowed = (origin: string): boolean => {
  const allowedOrigins = getAllowedOrigins();
  return allowedOrigins.includes(origin);
};

// Get a safe base URL
export const getSafeBaseURL = (): string => {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  // In development, allow localhost origins
  if (isDevelopment && currentOrigin.includes('localhost')) {
    return currentOrigin;
  }

  // Check if current origin is in our allowed list
  if (isOriginAllowed(currentOrigin)) {
    return currentOrigin;
  }

  // Fallback to production URL if current origin is not allowed
  return ALLOWED_ORIGINS.production[0] || 'https://honesti-dad.lovable.app/';
};

// Safely construct feedback URLs
export const getFeedbackURL = (slug: string): string => {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug provided');
  }

  // Sanitize slug to prevent injection
  const sanitizedSlug = slug.replace(/[^a-zA-Z0-9\-_]/g, '');

  if (sanitizedSlug !== slug) {
    throw new Error('Slug contains invalid characters');
  }

  const baseURL = getSafeBaseURL();
  return `${baseURL}/feedback/${sanitizedSlug}`;
};

// Safely construct reset password URLs
export const getResetPasswordURL = (): string => {
  const baseURL = getSafeBaseURL();
  return `${baseURL}/reset-password`;
};

// Safely construct auth redirect URLs
export const getAuthRedirectURL = (path: string = ''): string => {
  const baseURL = getSafeBaseURL();

  // Sanitize path to prevent injection
  const sanitizedPath = path.replace(/[^a-zA-Z0-9\-_\/]/g, '');

  return `${baseURL}${sanitizedPath}`;
};

// Validate and sanitize external URLs for sharing
export const validateExternalURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);

    // Allow only HTTPS for external URLs (except localhost in dev)
    if (urlObj.protocol !== 'https:' && !isDevelopment) {
      return false;
    }

    // Block known dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    if (dangerousProtocols.includes(urlObj.protocol)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

// Safe navigation helper
export const safeNavigate = (navigate: (path: string) => void, path: string): void => {
  // Only allow internal paths
  if (path.startsWith('/') && !path.startsWith('//')) {
    navigate(path);
  } else {
    console.warn('Attempted to navigate to external URL, blocked for security');
    navigate('/');
  }
}; 
