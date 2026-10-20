/**
 * Bộ sinh dữ liệu kiểm thử (Test Data Generator)
 * Tuân thủ quy chuẩn dự án VNTEST: [prefix]_[testName]_[timestamp]_[random]
 */
export class TestDataGenerator {
  /**
   * Tạo chuỗi ngẫu nhiên ký tự chữ và số
   */
  public static randomString(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Tạo chuỗi số ngẫu nhiên
   */
  public static randomNumber(length = 6): string {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
  }

  /**
   * Lấy timestamp định dạng YYYYMMDDHHmmss
   */
  public static getTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  /**
   * Sinh email duy nhất theo quy chuẩn: auto_[testName]_[timestamp]_[random]@vntest.vn
   */
  public static generateEmail(testName = 'test', domain = 'vntest.vn'): string {
    const sanitizedName = testName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const timestamp = this.getTimestamp();
    const random = this.randomString(4).toLowerCase();
    return `auto_${sanitizedName}_${timestamp}_${random}@${domain}`;
  }

  /**
   * Sinh mã định danh / code duy nhất theo quy chuẩn
   */
  public static generateCode(prefix = 'CODE', length = 4): string {
    const timestamp = this.getTimestamp().slice(-6);
    const random = this.randomString(length).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Sinh số điện thoại Việt Nam hợp lệ (10 số, đầu 09, 08, 03, 07)
   */
  public static generatePhoneNumber(): string {
    const prefixes = ['090', '091', '098', '086', '089', '038', '077'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    return `${prefix}${this.randomNumber(7)}`;
  }

  /**
   * Sinh số CCCD hợp lệ 12 chữ số
   */
  public static generateCitizenId(): string {
    return `00120${this.randomNumber(7)}`;
  }
}

