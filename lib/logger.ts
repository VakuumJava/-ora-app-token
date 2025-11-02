/**
 * Logging utility for development and production
 * Safely logs errors and important messages
 */

type LogLevel = 'error' | 'warn' | 'info';

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log errors - always shown in both dev and prod
   */
  error: (message: string, data?: any, error?: any) => {
    if (error instanceof Error) {
      console.error(`[ERROR] ${message}:`, error.message);
      if (isDev) console.error(error.stack);
    } else {
      console.error(`[ERROR] ${message}`, data || error);
    }
    
    // Send to monitoring service in production
    if (!isDev && error) {
      // TODO: Send to Sentry/LogRocket/etc
    }
  },

  /**
   * Log warnings - only in development
   */
  warn: (message: string, data?: any) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  /**
   * Log info - only in development
   */
  info: (message: string, data?: any) => {
    if (isDev) {
      
    }
  },

  /**
   * Log debug - only in development with DEBUG flag
   */
  debug: (message: string, data?: any) => {
    if (isDev && process.env.DEBUG) {
      
    }
  },
};

export default logger;
