const SINGAPORE_TIMEZONE = 'Asia/Singapore';

export class SingaporeTime {
  /**
   * Get current time in Singapore timezone
   */
  static now(): Date {
    // Simple approach: create a date that represents "now" in Singapore
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const singaporeTime = new Date(utc + (8 * 3600000)); // Singapore is UTC+8
    return singaporeTime;
  }

  /**
   * Round current Singapore time to next 15 minutes
   */
  static nowRounded15(): Date {
    const sgNow = this.now();
    const ms = 1000 * 60 * 15; // 15 minutes in milliseconds
    const rounded = new Date(Math.ceil(sgNow.getTime() / ms) * ms);
    return rounded;
  }

  /**
   * Format Singapore date for datetime-local input (YYYY-MM-DDTHH:mm)
   */
  static toLocalInputValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  /**
   * Format date with Singapore locale
   */
  static format(date: string | Date, formatString: string = 'dd/MM/yyyy HH:mm'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    // Simple formatting for common cases
    if (formatString === 'dd/MM/yyyy') {
      return d.toLocaleDateString('en-SG');
    }
    if (formatString === 'MMM dd') {
      return d.toLocaleDateString('en-SG', { month: 'short', day: '2-digit' });
    }
    if (formatString === 'HH:mm') {
      return d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (formatString === 'hh:mm a') {
      return d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    if (formatString === 'dd/MM/yyyy HH:mm') {
      return d.toLocaleString('en-SG', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
    
    // Default fallback
    return d.toLocaleString('en-SG');
  }

  /**
   * Singapore locale string formatting
   */
  static toLocaleString(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-SG', {
      timeZone: SINGAPORE_TIMEZONE,
      ...options
    });
  }

  /**
   * Calculate days between two dates
   */
  static daysBetween(startDate: string | Date, endDate: string | Date): number {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
}