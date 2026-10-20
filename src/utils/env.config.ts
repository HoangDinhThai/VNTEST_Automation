import * as dotenv from 'dotenv';
import * as path from 'path';

// Load file .env nếu chưa được nạp
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export class EnvConfig {
  public static readonly BASE_URL: string = process.env.BASE_URL || 'https://demo.playwright.dev';
  public static readonly ADMIN_USERNAME: string = process.env.ADMIN_USERNAME || 'admin';
  public static readonly ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || 'Password@123';
  public static readonly ENV: string = process.env.ENV || 'staging';
  public static readonly IS_CI: boolean = !!process.env.CI;

  /**
   * Lấy giá trị biến môi trường theo key với giá trị fallback mặc định
   */
  public static get(key: string, defaultValue = ''): string {
    return process.env[key] || defaultValue;
  }
}

