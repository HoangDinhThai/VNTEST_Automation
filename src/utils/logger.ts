export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  STEP = 'STEP',
}

export class Logger {
  private static formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  public static info(message: string): void {
    process.stdout.write(this.formatMessage(LogLevel.INFO, message) + '\n');
  }

  public static step(stepNumber: number | string, stepDescription: string): void {
    process.stdout.write(this.formatMessage(LogLevel.STEP, `Step ${stepNumber}: ${stepDescription}`) + '\n');
  }

  public static warn(message: string): void {
    process.stdout.write(this.formatMessage(LogLevel.WARN, message) + '\n');
  }

  public static error(message: string, error?: unknown): void {
    process.stderr.write(this.formatMessage(LogLevel.ERROR, message) + '\n');
    if (error) {
      process.stderr.write(this.formatMessage(LogLevel.ERROR, `${error}`) + '\n');
    }
  }

  public static debug(message: string): void {
    if (process.env.DEBUG) {
      process.stdout.write(this.formatMessage(LogLevel.DEBUG, message) + '\n');
    }
  }
}

