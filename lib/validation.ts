/**
 * Input Validation Utilities
 * Prevents SQL injection, XSS, and other input-based attacks
 */

export const validation = {
  /**
   * Validate UUID format
   */
  isValidUUID: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  /**
   * Validate email format
   */
  isValidEmail: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) && value.length <= 254;
  },

  /**
   * Validate wallet address (TON/Ethereum)
   */
  isValidWalletAddress: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    // TON: EQ... or UQ..., Ethereum: 0x...
    const tonRegex = /^(EQ|UQ)[A-Za-z0-9_-]{46}$/;
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    return tonRegex.test(value) || ethRegex.test(value);
  },

  /**
   * Validate nickname (alphanumeric, underscore, 3-20 chars)
   */
  isValidNickname: (value: any): boolean => {
    if (typeof value !== 'string') return false;
    const nicknameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return nicknameRegex.test(value);
  },

  /**
   * Validate positive number
   */
  isValidPositiveNumber: (value: any): boolean => {
    const num = Number(value);
    return !isNaN(num) && num > 0 && isFinite(num);
  },

  /**
   * Validate latitude/longitude coordinates
   */
  isValidCoordinates: (lat: any, lng: any): boolean => {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    return (
      !isNaN(latNum) &&
      !isNaN(lngNum) &&
      latNum >= -90 &&
      latNum <= 90 &&
      lngNum >= -180 &&
      lngNum <= 180
    );
  },

  /**
   * Validate string length
   */
  isValidLength: (
    value: any,
    min: number,
    max: number
  ): boolean => {
    if (typeof value !== 'string') return false;
    const length = value.trim().length;
    return length >= min && length <= max;
  },

  /**
   * Escape HTML entities to prevent XSS
   */
  escapeHtml: (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char] || char);
  },

  /**
   * Sanitize object keys to prevent property injection
   */
  sanitizeKeys: (obj: any, allowedKeys: string[]): Record<string, any> => {
    if (!obj || typeof obj !== 'object') return {};
    const sanitized: Record<string, any> = {};
    for (const key of allowedKeys) {
      if (key in obj) {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  },

  /**
   * Validate and parse JSON safely
   */
  safeJsonParse: <T>(json: string, fallback: T): T => {
    try {
      const parsed = JSON.parse(json);
      return typeof parsed === 'object' ? parsed : fallback;
    } catch {
      return fallback;
    }
  },
};

export default validation;
