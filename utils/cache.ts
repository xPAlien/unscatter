import { AnalysisResult } from '../types';

/**
 * Simple LRU cache for analysis results
 */
export class AnalysisCache {
  private cache = new Map<string, { result: AnalysisResult; timestamp: number }>();
  private readonly maxAge: number;
  private readonly maxSize: number;

  constructor(maxAge: number = 5 * 60 * 1000, maxSize: number = 50) {
    this.maxAge = maxAge; // Default: 5 minutes
    this.maxSize = maxSize;
  }

  /**
   * Generate cache key from input text and images
   */
  private getCacheKey(text: string, images: { mimeType: string; data: string }[]): string {
    const textKey = text.substring(0, 100);
    const imageKey = images.map(img => img.data.substring(0, 20)).join('_');
    return `${textKey}_${imageKey}`;
  }

  /**
   * Get cached result if it exists and is not expired
   */
  get(text: string, images: { mimeType: string; data: string }[]): AnalysisResult | null {
    const key = this.getCacheKey(text, images);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return cached.result;
  }

  /**
   * Store result in cache
   */
  set(text: string, images: { mimeType: string; data: string }[], result: AnalysisResult): void {
    const key = this.getCacheKey(text, images);

    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, { result, timestamp: Date.now() });
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
}
