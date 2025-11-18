/**
 * Structured logging service
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  error?: {
    message: string;
    stack?: string;
  };
  context?: Record<string, unknown>;
}

class Logger {
  private readonly isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  /**
   * Format log entry
   */
  private formatEntry(level: LogLevel, message: string, error?: Error, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack
        }
      }),
      ...(context && { context })
    };
  }

  /**
   * Log to console (dev) or external service (prod)
   */
  private log(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty print in development
      const style = {
        debug: 'color: #888',
        info: 'color: #2563eb',
        warn: 'color: #f59e0b',
        error: 'color: #dc2626; font-weight: bold'
      }[entry.level];

      console.log(
        `%c[${entry.level.toUpperCase()}] ${entry.message}`,
        style,
        entry.context || ''
      );

      if (entry.error) {
        console.error(entry.error.message);
        if (entry.error.stack) {
          console.error(entry.error.stack);
        }
      }
    } else {
      // In production, send to logging service
      // For now, just use console
      console.log(JSON.stringify(entry));

      // TODO: Send to external logging service
      // Example: Sentry, LogRocket, Datadog, etc.
      // if (window.Sentry) {
      //   window.Sentry.captureMessage(entry.message, entry.level);
      // }
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log(this.formatEntry('debug', message, undefined, context));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(this.formatEntry('info', message, undefined, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(this.formatEntry('warn', message, undefined, context));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(this.formatEntry('error', message, error, context));
  }
}

export const logger = new Logger();
