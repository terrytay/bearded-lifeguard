export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location?: string;
}

export class CalendarHelper {
  static formatDateForCalendar(date: Date): string {
    return date.toISOString().replace(/[:.]/g, '').split('T').join('T').slice(0, -4) + 'Z';
  }

  static generateGoogleCalendarUrl(event: CalendarEvent): string {
    const startDate = this.formatDateForCalendar(event.startDate);
    const endDate = this.formatDateForCalendar(event.endDate);
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: event.description || '',
      location: event.location || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  static generateOutlookCalendarUrl(event: CalendarEvent): string {
    const params = new URLSearchParams({
      subject: event.title,
      startdt: event.startDate.toISOString(),
      enddt: event.endDate.toISOString(),
      body: event.description || '',
      location: event.location || '',
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  static generateYahooCalendarUrl(event: CalendarEvent): string {
    const duration = Math.floor((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60)); // duration in minutes
    
    const params = new URLSearchParams({
      v: '60',
      title: event.title,
      st: this.formatDateForCalendar(event.startDate),
      dur: duration.toString().padStart(4, '0'),
      desc: event.description || '',
      in_loc: event.location || '',
    });

    return `https://calendar.yahoo.com/?${params.toString()}`;
  }

  static generateICSFile(event: CalendarEvent): string {
    const startDate = this.formatDateForCalendar(event.startDate);
    const endDate = this.formatDateForCalendar(event.endDate);
    const now = this.formatDateForCalendar(new Date());

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bearded Lifeguard//Booking Calendar//EN
BEGIN:VEVENT
UID:${now}-${Math.random().toString(36).substr(2, 9)}@beardedlifeguard.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
  }

  static downloadICSFile(event: CalendarEvent, filename: string = 'event.ics'): void {
    const icsContent = this.generateICSFile(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}