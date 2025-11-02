/**
 * Environment Variables Validation
 * Ensures all required variables are set and valid
 */

export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  NEXT_PUBLIC_APP_URL: string;
  APP_URL: string;
  NEXT_PUBLIC_TON_COLLECTION_ADDRESS?: string;
  NEXT_PUBLIC_ETH_COLLECTION_ADDRESS?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  DEBUG?: boolean;
}

export const requiredEnv: (keyof Environment)[] = [
  'NODE_ENV',
  'DATABASE_URL',
  'NEXT_PUBLIC_APP_URL',
  'APP_URL',
];

export const optionalEnv: (keyof Environment)[] = [
  'NEXT_PUBLIC_TON_COLLECTION_ADDRESS',
  'NEXT_PUBLIC_ETH_COLLECTION_ADDRESS',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'DEBUG',
];

/**
 * Validate environment variables
 */
export function validateEnv(): Environment {
  const missing: string[] = [];
  const invalid: string[] = [];

  // Check required variables
  for (const key of requiredEnv) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    }
  }

  // Validate specific formats
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql')) {
    invalid.push('DATABASE_URL must start with postgresql');
  }

  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('http')) {
    invalid.push('NEXT_PUBLIC_APP_URL must start with http or https');
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      console.warn(`⚠️  ${message}`);
    }
  }

  if (invalid.length > 0) {
    const message = `Invalid environment variables: ${invalid.join(', ')}`;
    throw new Error(message);
  }

  return {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    APP_URL: process.env.APP_URL!,
    NEXT_PUBLIC_TON_COLLECTION_ADDRESS: process.env.NEXT_PUBLIC_TON_COLLECTION_ADDRESS,
    NEXT_PUBLIC_ETH_COLLECTION_ADDRESS: process.env.NEXT_PUBLIC_ETH_COLLECTION_ADDRESS,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    DEBUG: process.env.DEBUG === 'true',
  };
}

// Validate on module load
export const env = validateEnv();
