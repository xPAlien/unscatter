/**
 * Client-side rate limiter to prevent excessive API calls
 */
export class RateLimiter {
  private attempts: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if a request can be made
   */
  canMakeRequest(): boolean {
    const now = Date.now();
    this.attempts = this.attempts.filter(time => now - time < this.windowMs);

    if (this.attempts.length >= this.maxRequests) {
      return false;
    }

    this.attempts.push(now);
    return true;
  }

  /**
   * Get time in milliseconds until next request is allowed
   */
  getTimeUntilNextRequest(): number {
    if (this.attempts.length < this.maxRequests) return 0;

    const now = Date.now();
    const oldestAttempt = this.attempts[0];
    const timeElapsed = now - oldestAttempt;

    return Math.max(0, this.windowMs - timeElapsed);
  }

  /**
   * Get formatted wait time message
   */
  getWaitTimeMessage(): string {
    const waitMs = this.getTimeUntilNextRequest();
    const waitSeconds = Math.ceil(waitMs / 1000);

    if (waitSeconds < 60) {
      return `${waitSeconds} second${waitSeconds !== 1 ? 's' : ''}`;
    }

    const waitMinutes = Math.ceil(waitSeconds / 60);
    return `${waitMinutes} minute${waitMinutes !== 1 ? 's' : ''}`;
  }

  /**
   * Reset all attempts (useful for testing or manual override)
   */
  reset(): void {
    this.attempts = [];
  }
}
