/**
 * Input sanitization utilities
 */

/**
 * Sanitize user input to prevent prompt injection attacks
 */
export const sanitizeUserInput = (input: string): string => {
  if (!input) return '';

  let sanitized = input;

  // Remove potential prompt injection patterns
  const injectionPatterns = [
    /\b(ignore|disregard|forget)\s+(previous|all|above|prior)\s+(instructions?|prompts?|commands?)/gi,
    /\b(system|assistant|user|role)\s*:/gi,
    /\[INST\]/gi,
    /\[\/INST\]/gi,
    /<\|.*?\|>/g,
  ];

  injectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  });

  // Limit length to prevent extremely long inputs
  const MAX_LENGTH = 10000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized.trim();
};

/**
 * Get sanitized error message for display to users
 */
export const getSafeErrorMessage = (error: Error | string): string => {
  const message = typeof error === 'string' ? error : error.message;
  const lowerMessage = message.toLowerCase();

  // Check for specific error types and return user-friendly messages
  if (lowerMessage.includes('api key') ||
      lowerMessage.includes('unauthorized') ||
      lowerMessage.includes('forbidden') ||
      lowerMessage.includes('authentication')) {
    return 'Authentication error. Please check your API configuration.';
  }

  if (lowerMessage.includes('quota') ||
      lowerMessage.includes('limit exceeded') ||
      lowerMessage.includes('rate limit')) {
    return 'Service quota exceeded. Please try again in a few minutes.';
  }

  if (lowerMessage.includes('network') ||
      lowerMessage.includes('timeout') ||
      lowerMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (lowerMessage.includes('invalid') ||
      lowerMessage.includes('parse') ||
      lowerMessage.includes('json')) {
    return 'Invalid response received. Please try again.';
  }

  // Don't expose internal error details
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Validate and sanitize file input
 */
export const validateFileInput = (file: File): { valid: boolean; error?: string } => {
  const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
  const MAX_SIZE = 4 * 1024 * 1024; // 4MB

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type for "${file.name}". Please use PNG, JPG, or WEBP.`
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" is too large. Maximum size is 4MB.`
    };
  }

  return { valid: true };
};
