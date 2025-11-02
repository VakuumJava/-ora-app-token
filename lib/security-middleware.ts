import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * CORS Headers Middleware
 */
export function withCORS(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        headers: getCORSHeaders(req),
      });
    }

    const response = await handler(req);
    const corsHeaders = getCORSHeaders(req);

    // Add CORS headers to response
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }

    return response;
  };
}

/**
 * Get CORS headers based on origin
 */
function getCORSHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean);

  const isAllowed = allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * CSRF Token Validation
 */
const CSRF_TOKENS = new Map<string, { token: string; timestamp: number }>();
const CSRF_TOKEN_LIFETIME = 1 * 60 * 60 * 1000; // 1 hour

export function generateCSRFToken(sessionId: string): string {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  CSRF_TOKENS.set(sessionId, {
    token,
    timestamp: Date.now(),
  });

  // Clean up old tokens
  for (const [key, value] of CSRF_TOKENS.entries()) {
    if (Date.now() - value.timestamp > CSRF_TOKEN_LIFETIME) {
      CSRF_TOKENS.delete(key);
    }
  }

  return token;
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = CSRF_TOKENS.get(sessionId);

  if (!stored) {
    logger.warn('CSRF token not found', { sessionId });
    return false;
  }

  if (Date.now() - stored.timestamp > CSRF_TOKEN_LIFETIME) {
    CSRF_TOKENS.delete(sessionId);
    logger.warn('CSRF token expired', { sessionId });
    return false;
  }

  const isValid = token === stored.token;

  if (!isValid) {
    logger.warn('CSRF token mismatch', { sessionId });
  }

  // Token is single-use
  CSRF_TOKENS.delete(sessionId);

  return isValid;
}

/**
 * CSRF Middleware for state-changing requests
 */
export function withCSRFProtection(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    // Skip CSRF check for GET requests
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      return handler(req);
    }

    // Skip CSRF check if not in production or if explicitly disabled
    if (process.env.NODE_ENV !== 'production') {
      return handler(req);
    }

    const csrfToken = req.headers.get('x-csrf-token');
    const sessionId = req.headers.get('x-session-id');

    if (!csrfToken || !sessionId) {
      logger.warn('Missing CSRF token or session ID');
      return NextResponse.json(
        { error: 'Missing CSRF token' },
        { status: 403 }
      );
    }

    if (!validateCSRFToken(sessionId, csrfToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    return handler(req);
  };
}

/**
 * Security Headers Middleware
 */
export function withSecurityHeaders(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const response = await handler(req);

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';"
    );

    return response;
  };
}
