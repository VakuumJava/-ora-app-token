import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

export interface ApiResponseObject<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Safely wrap API route handlers with error handling
 * @example
 * export const POST = withErrorHandler(async (req) => {
 *   const data = await fetchData();
 *   return ApiResponseHelper.success(data);
 * });
 */
export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      logger.error(
        `API Error: ${req.method} ${req.nextUrl.pathname}`,
        {
          method: req.method,
          path: req.nextUrl.pathname,
          errorType: error?.constructor?.name,
        },
        error
      );

      // Don't expose internal errors to client
      const message = error?.message || 'Internal server error';
      const statusCode = error?.statusCode || 500;

      return NextResponse.json(
        {
          success: false,
          error: process.env.NODE_ENV === 'development' ? message : 'Internal error',
          message: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
        },
        { status: statusCode }
      );
    }
  };
}

/**
 * Helper class for consistent API responses
 */
export class ApiResponseHelper {
  static success<T>(data: T, message?: string): NextResponse {
    return NextResponse.json({
      success: true,
      data,
      message,
    });
  }

  static error(error: string, statusCode: number = 400, details?: any): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error,
        ...(process.env.NODE_ENV === 'development' && details && { details }),
      },
      { status: statusCode }
    );
  }

  static created<T>(data: T, message?: string): NextResponse {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      },
      { status: 201 }
    );
  }

  static notFound(message: string = 'Not found'): NextResponse {
    return NextResponse.json(
      { success: false, error: message },
      { status: 404 }
    );
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse {
    return NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    );
  }

  static forbidden(message: string = 'Forbidden'): NextResponse {
    return NextResponse.json(
      { success: false, error: message },
      { status: 403 }
    );
  }

  static badRequest(message: string): NextResponse {
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
