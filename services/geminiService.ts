import { AnalysisResult } from '../types';
import { API } from '../utils/constants';
import { RateLimiter } from '../utils/rateLimiter';
import { AnalysisCache } from '../utils/cache';
import { getSafeErrorMessage } from '../utils/sanitize';
import { logger } from '../utils/logger';

// Initialize rate limiter and cache
const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
const cache = new AnalysisCache();

/**
 * Analyze content using the backend API proxy
 * This keeps the API key secure on the server side
 */
export const analyzeContent = async (
  inputText: string,
  images: { mimeType: string; data: string }[]
): Promise<AnalysisResult> => {
  try {
    // Check rate limit
    if (!rateLimiter.canMakeRequest()) {
      const waitTime = rateLimiter.getWaitTimeMessage();
      logger.warn('Rate limit exceeded', { waitTime });
      throw new Error(`Rate limit exceeded. Please wait ${waitTime} before trying again.`);
    }

    // Check cache
    const cached = cache.get(inputText, images);
    if (cached) {
      logger.info('Using cached result');
      return cached;
    }

    logger.info('Making API request', {
      textLength: inputText.length,
      imageCount: images.length
    });

    // Call backend API
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.ANALYZE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputText,
        images
      }),
      signal: AbortSignal.timeout(API.TIMEOUT)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const result: AnalysisResult = await response.json();

    // Validate result structure
    if (!result || !Array.isArray(result.tasks) || typeof result.nextActionId !== 'number') {
      throw new Error('Invalid data structure received from API');
    }

    // Cache the result
    cache.set(inputText, images, result);

    logger.info('Analysis complete', {
      taskCount: result.tasks.length,
      nextActionId: result.nextActionId
    });

    return result;
  } catch (error) {
    logger.error('Analysis failed', error as Error, {
      textLength: inputText.length,
      imageCount: images.length
    });

    // Return sanitized error message
    const safeMessage = getSafeErrorMessage(error as Error);
    throw new Error(safeMessage);
  }
};

/**
 * Check if the API server is healthy
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });

    return response.ok;
  } catch (error) {
    logger.error('Health check failed', error as Error);
    return false;
  }
};

/**
 * Clear the analysis cache
 */
export const clearCache = (): void => {
  cache.clear();
  logger.info('Cache cleared');
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => cache.getStats();
