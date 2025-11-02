import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * Simple in-memory rate limiter
 * For production, use Redis or similar
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number = 60 * 1000; // 1 minute
  private readonly maxRequests: number = 100; // per window

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const recentRequests = requests.filter((time) => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      logger.warn(`Rate limit exceeded for ${identifier}`);
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Get rate limit identifier from request
 * Uses IP address or user ID if available
 */
export function getIdentifier(req: NextRequest): string {
  // Try to get from header first (if behind proxy)
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Fall back to other headers
  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Middleware for rate limiting
 */
export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 60 * 1000
) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      const identifier = getIdentifier(req);

      // Simple check (in production use Redis)
      const key = `${identifier}:${req.method}:${req.nextUrl.pathname}`;
      const requests = (global as any).rateLimit || new Map();
      const now = Date.now();
      const recentRequests = (requests.get(key) || []).filter(
        (t: number) => now - t < windowMs
      );

      if (recentRequests.length >= maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }

      recentRequests.push(now);
      requests.set(key, recentRequests);
      (global as any).rateLimit = requests;

      return handler(req);
    };
  };
}
