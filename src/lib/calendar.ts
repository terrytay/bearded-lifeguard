export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  location?: string;
}

export class CalendarHelper {
  static formatDateForCalendar(date: Date): string {
    // Format date for calendar (.ics) files - keep as local Singapore time, not UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Return as local time (no Z suffix) so calendar apps treat it as local time
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  }

  static generateGoogleCalendarUrl(event: CalendarEvent): string {
    const startDate = this.formatDateForCalendar(event.startDate);
    const endDate = this.formatDateForCalendar(event.endDate);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: event.description || "",
      location: event.location || "",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  static generateOutlookCalendarUrl(event: CalendarEvent): string {
    // Use local time format for Outlook - it will handle timezone properly
    const formatForOutlook = (date: Date) => {
      return date.toISOString().slice(0, -1); // Remove Z to treat as local time
    };

    const params = new URLSearchParams({
      subject: event.title,
      startdt: formatForOutlook(event.startDate),
      enddt: formatForOutlook(event.endDate),
      body: event.description || "",
      location: event.location || "",
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  }

  static generateYahooCalendarUrl(event: CalendarEvent): string {
    const totalMinutes = Math.round(
      (event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60)
    ); // duration in minutes
    
    // Convert total minutes to HHMM format for Yahoo Calendar
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const durationHHMM = hours.toString().padStart(2, "0") + minutes.toString().padStart(2, "0");

    const params = new URLSearchParams({
      v: "60",
      title: event.title,
      st: this.formatDateForCalendar(event.startDate),
      dur: durationHHMM,
      desc: event.description || "",
      in_loc: event.location || "",
    });

    return `https://calendar.yahoo.com/?${params.toString()}`;
  }

  static generateICSFile(event: CalendarEvent): string {
    const startDate = this.formatDateForCalendar(event.startDate);
    const endDate = this.formatDateForCalendar(event.endDate);
    const now = this.formatDateForCalendar(new Date());

    // Add timezone info for ICS files
    const timezoneBlock = `BEGIN:VTIMEZONE
TZID:Asia/Singapore
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+0800
TZOFFSETTO:+0800
TZNAME:SGT
END:STANDARD
END:VTIMEZONE
`;

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bearded Lifeguard//Booking Calendar//EN
${timezoneBlock}BEGIN:VEVENT
UID:${now}-${Math.random().toString(36).substr(2, 9)}@beardedlifeguard.com
DTSTAMP:${now}
DTSTART;TZID=Asia/Singapore:${startDate}
DTEND;TZID=Asia/Singapore:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
  }

  static downloadICSFile(
    event: CalendarEvent,
    filename: string = "event.ics"
  ): void {
    const icsContent = this.generateICSFile(event);
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}
