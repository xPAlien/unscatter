/**
 * Application-wide constants
 */

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 4 * 1024 * 1024, // 4MB
  MAX_FILES: 10,
  ACCEPTED_TYPES: ['image/png', 'image/jpeg', 'image/webp'] as const,
  ACCEPTED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.webp'] as const,
  ACCEPTED_MIME_TYPES: {
    PNG: 'image/png',
    JPEG: 'image/jpeg',
    WEBP: 'image/webp'
  } as const
} as const;

// API Configuration
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    ANALYZE: '/api/analyze',
    HEALTH: '/health'
  },
  TIMEOUT: 30000 // 30 seconds
} as const;

// Rate Limiting Configuration
export const RATE_LIMIT = {
  MAX_REQUESTS: 10,
  WINDOW_MS: 60000, // 1 minute
  ERROR_MESSAGE: 'Too many requests. Please wait before trying again.'
} as const;

// Cache Configuration
export const CACHE = {
  MAX_AGE: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 50 // Maximum number of cached items
} as const;

// Input Validation
export const INPUT = {
  MAX_TEXT_LENGTH: 10000,
  MIN_TEXT_LENGTH: 1
} as const;

// Theme Configuration
export const THEME = {
  STORAGE_KEY: 'unscatter-theme',
  DEFAULT: 'light' as const,
  OPTIONS: ['light', 'gray', 'dark'] as const
} as const;

// Animation Configuration
export const ANIMATION = {
  FADE_IN_DELAY_MS: 75,
  TRANSITION_DURATION_MS: 200
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  EMPTY_INPUT: 'Input cannot be empty. Please provide text or images.',
  FILE_TOO_LARGE: (sizeMB: number) => `File exceeds maximum size of ${sizeMB}MB`,
  INVALID_FILE_TYPE: (name: string) => `Invalid file type for "${name}". Please use PNG, JPG, or WEBP.`,
  MAX_FILES_EXCEEDED: (max: number) => `Maximum ${max} images allowed`,
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  RATE_LIMIT_EXCEEDED: (waitTime: string) => `Rate limit exceeded. Please wait ${waitTime} before trying again.`,
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  ANALYSIS_COMPLETE: 'Analysis complete'
} as const;

// Feature Flags
export const FEATURES = {
  MULTI_IMAGE_UPLOAD: true,
  RESULT_EXPORT: false,
  COLLABORATIVE_MODE: false,
  OFFLINE_MODE: false,
  ANALYTICS: false
} as const;

// External Links
export const LINKS = {
  GEMINI_API_KEY: 'https://aistudio.google.com/apikey',
  GITHUB_REPO: 'https://github.com/xPAlien/unscatter',
  GITHUB_ISSUES: 'https://github.com/xPAlien/unscatter/issues'
} as const;
