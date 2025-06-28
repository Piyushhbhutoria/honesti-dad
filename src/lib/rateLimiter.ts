// Client-side rate limiting utility

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private readonly cleanupInterval: number;

  constructor() {
    // Clean up old entries every 5 minutes
    this.cleanupInterval = window.setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  // Check if an action is rate limited
  isRateLimited(
    key: string,
    maxAttempts: number,
    windowMs: number,
    userId?: string
  ): boolean {
    const now = Date.now();
    const compositeKey = userId ? `${userId}:${key}` : key;
    const entry = this.storage.get(compositeKey);

    if (!entry) {
      // First attempt
      this.storage.set(compositeKey, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return false;
    }

    // Check if we're outside the window - if so, reset
    if (now - entry.firstAttempt > windowMs) {
      this.storage.set(compositeKey, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return false;
    }

    // We're within the window, increment count
    entry.count++;
    entry.lastAttempt = now;
    this.storage.set(compositeKey, entry);

    return entry.count > maxAttempts;
  }

  // Get remaining time until rate limit resets
  getResetTime(key: string, windowMs: number, userId?: string): number {
    const compositeKey = userId ? `${userId}:${key}` : key;
    const entry = this.storage.get(compositeKey);

    if (!entry) return 0;

    const elapsed = Date.now() - entry.firstAttempt;
    return Math.max(0, windowMs - elapsed);
  }

  // Reset rate limit for a specific key
  reset(key: string, userId?: string): void {
    const compositeKey = userId ? `${userId}:${key}` : key;
    this.storage.delete(compositeKey);
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [key, entry] of this.storage.entries()) {
      if (now - entry.lastAttempt > maxAge) {
        this.storage.delete(key);
      }
    }
  }

  // Destroy the rate limiter and cleanup
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.storage.clear();
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Pre-defined rate limit configurations
export const RATE_LIMITS = {
  // Message sending: 5 messages per minute
  SEND_MESSAGE: {
    key: 'send_message',
    maxAttempts: 5,
    windowMs: 60 * 1000, // 1 minute
  },

  // Feedback request creation: 3 requests per hour
  CREATE_FEEDBACK_REQUEST: {
    key: 'create_feedback_request',
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },

  // Password reset: 3 attempts per 15 minutes
  PASSWORD_RESET: {
    key: 'password_reset',
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Login attempts: 5 attempts per 15 minutes
  LOGIN_ATTEMPT: {
    key: 'login_attempt',
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Copy/Share actions: 10 per minute (prevent spam)
  COPY_SHARE: {
    key: 'copy_share',
    maxAttempts: 10,
    windowMs: 60 * 1000, // 1 minute
  }
};

// Helper function to check rate limit with predefined configs
export const checkRateLimit = (
  limitConfig: typeof RATE_LIMITS[keyof typeof RATE_LIMITS],
  userId?: string
): { isLimited: boolean; resetTime: number } => {
  const isLimited = rateLimiter.isRateLimited(
    limitConfig.key,
    limitConfig.maxAttempts,
    limitConfig.windowMs,
    userId
  );

  const resetTime = isLimited
    ? rateLimiter.getResetTime(limitConfig.key, limitConfig.windowMs, userId)
    : 0;

  return { isLimited, resetTime };
};

// Helper to format reset time for user display
export const formatResetTime = (resetTime: number): string => {
  if (resetTime <= 0) return '';

  const minutes = Math.ceil(resetTime / 60000);
  if (minutes === 1) return '1 minute';
  if (minutes < 60) return `${minutes} minutes`;

  const hours = Math.ceil(minutes / 60);
  return hours === 1 ? '1 hour' : `${hours} hours`;
}; 
