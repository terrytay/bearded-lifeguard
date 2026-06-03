import { SingaporeTime } from "./singapore-time";

export type ReportType = 'bookings' | 'lifeguards';
export type ExportFormat = 'csv' | 'pdf';

// Booking Report Field Definitions
export interface BookingReportFields {
  order_id: boolean;
  customer_name: boolean;
  customer_email: boolean;
  customer_phone: boolean;
  service_type: boolean;
  custom_service: boolean;
  location: boolean;
  start_datetime: boolean;
  end_datetime: boolean;
  hours: boolean;
  lifeguards: boolean;
  amount: boolean;
  status: boolean;
  payment_status: boolean;
  created_at: boolean;
  lifeguards_assigned_count: boolean; // Computed field
  revenue_per_hour: boolean; // Computed field
  service_display_name: boolean; // Computed field
  actual_revenue_only: boolean; // Computed field - Amount only if paid & not cancelled
  is_revenue_generating: boolean; // Computed field - Boolean if contributes to actual revenue
  revenue_status: boolean; // Computed field - 'Actual', 'Potential', 'Lost', 'At-Risk'
  days_since_booking: boolean; // Computed field - For at-risk analysis
  // Payroll / period proration (computed relative to the selected date range)
  hours_in_period: boolean; // Computed field - billed hours prorated to the selected period
  amount_in_period: boolean; // Computed field - amount prorated to the selected period
  is_prorated: boolean; // Computed field - true when the service window extends beyond the range
  proration_note: boolean; // Computed field - human-readable proration breakdown
}

// Lifeguard Report Field Definitions
export interface LifeguardReportFields {
  name: boolean;
  contact_number: boolean;
  is_active: boolean;
  created_at: boolean;
  updated_at: boolean;
  total_assignments: boolean; // Computed field
  active_assignments: boolean; // Computed field
  total_revenue_generated: boolean; // Computed field
  avg_assignment_duration: boolean; // Computed field
  total_prorated_hours: boolean; // Computed field - payroll hours (non-cancelled, prorated)
  cancelled_assignments: boolean; // Computed field - cancelled assignments in the period
}

// Field Metadata for UI
export interface FieldDefinition {
  key: string;
  label: string;
  description?: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  required?: boolean;
  computed?: boolean;
  group: 'basic' | 'contact' | 'service' | 'financial' | 'timestamps' | 'computed';
}

// Booking Field Definitions
export const BOOKING_FIELD_DEFINITIONS: FieldDefinition[] = [
  // Basic Info
  { key: 'order_id', label: 'Order ID', type: 'string', required: true, group: 'basic' },
  { key: 'customer_name', label: 'Customer Name', type: 'string', group: 'basic' },
  { key: 'service_type', label: 'Service Type', type: 'string', group: 'service' },
  { key: 'custom_service', label: 'Custom Service', type: 'string', group: 'service' },
  { key: 'service_display_name', label: 'Service Display Name', type: 'string', computed: true, group: 'service', description: 'Formatted service name with custom details' },
  { key: 'location', label: 'Location', type: 'string', group: 'service' },
  { key: 'status', label: 'Booking Status', type: 'string', group: 'basic' },
  
  // Contact Info
  { key: 'customer_email', label: 'Customer Email', type: 'string', group: 'contact' },
  { key: 'customer_phone', label: 'Customer Phone', type: 'string', group: 'contact' },
  
  // Service Details
  { key: 'start_datetime', label: 'Start Date & Time', type: 'date', group: 'service' },
  { key: 'end_datetime', label: 'End Date & Time', type: 'date', group: 'service' },
  { key: 'hours', label: 'Duration (Hours)', type: 'number', group: 'service' },
  { key: 'lifeguards', label: 'Lifeguards Required', type: 'number', group: 'service' },
  { key: 'lifeguards_assigned_count', label: 'Lifeguards Assigned', type: 'number', computed: true, group: 'computed', description: 'Number of lifeguards actually assigned' },
  
  // Financial
  { key: 'amount', label: 'Booking Amount', type: 'currency', group: 'financial' },
  { key: 'payment_status', label: 'Payment Status', type: 'string', group: 'financial' },
  { key: 'revenue_per_hour', label: 'Revenue per Hour', type: 'currency', computed: true, group: 'computed', description: 'Booking amount divided by hours' },
  
  // Timestamps
  { key: 'created_at', label: 'Created Date', type: 'date', group: 'timestamps' },
  
  // New Revenue Classification Fields
  { key: 'actual_revenue_only', label: 'Actual Revenue', type: 'currency', computed: true, group: 'computed', description: 'Revenue amount only if booking is paid and not cancelled' },
  { key: 'is_revenue_generating', label: 'Revenue Generating', type: 'boolean', computed: true, group: 'computed', description: 'True if booking contributes to actual revenue' },
  { key: 'revenue_status', label: 'Revenue Status', type: 'string', computed: true, group: 'computed', description: 'Categorizes revenue as Actual, Potential, Lost, or At-Risk' },
  { key: 'days_since_booking', label: 'Days Since Booking', type: 'number', computed: true, group: 'computed', description: 'Number of days since booking was created' },

  // Payroll / period proration
  { key: 'hours_in_period', label: 'Hours In Period (Prorated)', type: 'number', computed: true, group: 'computed', description: 'Billed service hours prorated to the overlap with the selected period — the payroll hours' },
  { key: 'amount_in_period', label: 'Amount In Period (Prorated)', type: 'currency', computed: true, group: 'computed', description: 'Booking amount prorated to the portion of the service that falls within the selected period' },
  { key: 'is_prorated', label: 'Prorated?', type: 'boolean', computed: true, group: 'computed', description: 'True when the service window extends beyond the selected period (only the in-period portion is counted)' },
  { key: 'proration_note', label: 'Proration Breakdown', type: 'string', computed: true, group: 'computed', description: 'Human-readable breakdown of how hours/amount were prorated for the selected period' },
];

// Lifeguard Field Definitions
export const LIFEGUARD_FIELD_DEFINITIONS: FieldDefinition[] = [
  // Basic Info
  { key: 'name', label: 'Name', type: 'string', required: true, group: 'basic' },
  { key: 'contact_number', label: 'Contact Number', type: 'string', group: 'contact' },
  { key: 'is_active', label: 'Active Status', type: 'boolean', group: 'basic' },
  
  // Timestamps
  { key: 'created_at', label: 'Created Date', type: 'date', group: 'timestamps' },
  { key: 'updated_at', label: 'Last Updated', type: 'date', group: 'timestamps' },
  
  // Computed Performance Fields
  { key: 'total_assignments', label: 'Total Assignments', type: 'number', computed: true, group: 'computed', description: 'Total number of bookings assigned to this lifeguard' },
  { key: 'active_assignments', label: 'Active Assignments', type: 'number', computed: true, group: 'computed', description: 'Number of confirmed/ongoing assignments' },
  { key: 'total_revenue_generated', label: 'Total Revenue Generated', type: 'currency', computed: true, group: 'computed', description: 'Sum of amounts from assigned (non-cancelled) bookings in the period' },
  { key: 'avg_assignment_duration', label: 'Average Assignment Duration', type: 'number', computed: true, group: 'computed', description: 'Average prorated in-period hours per assignment' },
  { key: 'total_prorated_hours', label: 'Prorated Hours (Payroll)', type: 'number', computed: true, group: 'computed', description: 'Total in-period prorated service hours across non-cancelled assignments' },
  { key: 'cancelled_assignments', label: 'Cancelled Assignments', type: 'number', computed: true, group: 'computed', description: 'Number of cancelled bookings assigned to this lifeguard in the period' },
];

// Default field selections
export const DEFAULT_BOOKING_FIELDS: BookingReportFields = {
  order_id: true,
  customer_name: true,
  customer_email: false,
  customer_phone: false,
  service_type: true,
  custom_service: false,
  location: false,
  start_datetime: true,
  end_datetime: false,
  hours: true,
  lifeguards: true,
  amount: true,
  status: true,
  payment_status: true,
  created_at: false,
  lifeguards_assigned_count: true,
  revenue_per_hour: false,
  service_display_name: false,
  // New revenue fields (default to false for existing reports)
  actual_revenue_only: false,
  is_revenue_generating: true,
  revenue_status: true,
  days_since_booking: false,
  // Payroll / proration fields (default-on so payroll figures are visible)
  hours_in_period: true,
  amount_in_period: true,
  is_prorated: true,
  proration_note: true,
};

export const DEFAULT_LIFEGUARD_FIELDS: LifeguardReportFields = {
  name: true,
  contact_number: true,
  is_active: true,
  created_at: false,
  updated_at: false,
  total_assignments: true,
  active_assignments: true,
  total_revenue_generated: true,
  avg_assignment_duration: false,
  total_prorated_hours: true,
  cancelled_assignments: true,
};

// Date Range Presets
export interface DateRangePreset {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

export function getDateRangePresets(): DateRangePreset[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return [
    {
      label: 'Today',
      value: 'today',
      startDate: today,
      endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1), // End of today
    },
    {
      label: 'This Week',
      value: 'thisWeek',
      startDate: startOfWeek,
      endDate: now,
    },
    {
      label: 'This Month',
      value: 'thisMonth',
      startDate: startOfMonth,
      endDate: now,
    },
    {
      label: 'Last Month',
      value: 'lastMonth',
      startDate: startOfLastMonth,
      endDate: endOfLastMonth,
    },
    {
      label: 'This Quarter',
      value: 'thisQuarter',
      startDate: startOfQuarter,
      endDate: now,
    },
    {
      label: 'This Year',
      value: 'thisYear',
      startDate: startOfYear,
      endDate: now,
    },
  ];
}

// ---------------------------------------------------------------------------
// Service-date / payroll proration helpers
//
// Bookings store `start_datetime`/`end_datetime` as naive Singapore-local
// strings (e.g. "2026-05-31T20:00") and `hours` == the wall-clock duration
// rounded up. Reports filter by SERVICE date using an overlap predicate and
// prorate billed hours/amount to the portion that falls inside the selected
// range. All comparisons stay in the same naive-SGT convention so day
// boundaries line up with the stored data.
// ---------------------------------------------------------------------------

export interface PeriodProration {
  hoursInPeriod: number; // billed hours attributable to the selected period
  amountInPeriod: number; // amount attributable to the selected period
  fraction: number; // 0..1 share of the service that falls inside the range
  isProrated: boolean; // true when the window extends beyond the range
}

/**
 * Normalize a report date range to naive Singapore-local boundary strings.
 * `rangeStart` becomes start-of-day; `rangeEnd` becomes end-of-day (inclusive)
 * so events later on the last selected day are not clipped.
 */
export function normalizeReportRange(
  startDate: string,
  endDate: string
): { rangeStart: string; rangeEnd: string } {
  const datePart = (value: string): string => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    const d = new Date(value);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  return {
    rangeStart: `${datePart(startDate)}T00:00:00`,
    rangeEnd: `${datePart(endDate)}T23:59:59.999`,
  };
}

/**
 * Compute how much of a booking's billed hours / amount falls inside the
 * selected period. Proration is by wall-clock overlap fraction, so a fully
 * contained booking keeps 100% of its billed hours/amount.
 */
export function computeProration(
  booking: {
    start_datetime?: string | null;
    end_datetime?: string | null;
    hours?: number | null;
    amount?: number | null;
  },
  rangeStart: string,
  rangeEnd: string
): PeriodProration {
  const hours = booking.hours || 0;
  const amount = booking.amount || 0;

  const start = booking.start_datetime
    ? new Date(booking.start_datetime).getTime()
    : NaN;
  const end = booking.end_datetime
    ? new Date(booking.end_datetime).getTime()
    : NaN;
  const rs = new Date(rangeStart).getTime();
  const re = new Date(rangeEnd).getTime();

  // Without a valid window we cannot prorate — treat as fully in-period.
  if (isNaN(start) || isNaN(end) || isNaN(rs) || isNaN(re) || end <= start) {
    return {
      hoursInPeriod: hours,
      amountInPeriod: amount,
      fraction: 1,
      isProrated: false,
    };
  }

  const totalMs = end - start;
  const overlapMs = Math.max(0, Math.min(end, re) - Math.max(start, rs));
  const fraction = Math.min(1, Math.max(0, overlapMs / totalMs));
  const isProrated = start < rs || end > re;

  return {
    hoursInPeriod: hours * fraction,
    amountInPeriod: amount * fraction,
    fraction,
    isProrated,
  };
}

/**
 * Build a human-readable breakdown explaining the proration for the selected
 * period, e.g. "Prorated to 01/06/2026–30/06/2026: 4.0 of 8 hrs (50%),
 * $120.00 of $240.00. Full service 31/05/2026 20:00 → 01/06/2026 04:00".
 * Returns an empty string when the booking is fully inside the period.
 */
export function buildProrationNote(
  booking: {
    start_datetime?: string | null;
    end_datetime?: string | null;
    hours?: number | null;
    amount?: number | null;
  },
  rangeStart: string,
  rangeEnd: string,
  proration: PeriodProration
): string {
  if (!proration.isProrated) return "";

  const day = (v: string) => SingaporeTime.format(v, "dd/MM/yyyy");
  const dt = (v?: string | null) =>
    v ? SingaporeTime.format(v, "dd/MM/yyyy HH:mm") : "-";

  const pct = Math.round(proration.fraction * 100);
  const totalHours = booking.hours || 0;
  const totalAmount = booking.amount || 0;

  return (
    `Prorated to ${day(rangeStart)}–${day(rangeEnd)}: ` +
    `${proration.hoursInPeriod.toFixed(1)} of ${totalHours} hrs (${pct}%), ` +
    `$${proration.amountInPeriod.toFixed(2)} of $${totalAmount.toFixed(2)}. ` +
    `Full service ${dt(booking.start_datetime)} → ${dt(booking.end_datetime)}.`
  );
}

// Report Data Types
export interface BookingReportData {
  order_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  service_type?: string;
  custom_service?: string;
  location?: string;
  start_datetime?: string;
  end_datetime?: string;
  hours?: number;
  lifeguards?: number;
  amount?: number;
  status?: string;
  payment_status?: string;
  created_at?: string;
  lifeguards_assigned_count?: number;
  revenue_per_hour?: number;
  service_display_name?: string;
  // New revenue classification fields
  actual_revenue_only?: number;
  is_revenue_generating?: boolean;
  revenue_status?: 'Actual' | 'Potential' | 'Lost' | 'At-Risk';
  days_since_booking?: number;
  // Payroll / period proration
  hours_in_period?: number;
  amount_in_period?: number;
  is_prorated?: boolean;
  proration_note?: string;
}

export interface LifeguardReportData {
  name?: string;
  contact_number?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  total_assignments?: number;
  active_assignments?: number;
  total_revenue_generated?: number;
  avg_assignment_duration?: number;
  total_prorated_hours?: number;
  cancelled_assignments?: number;
}

export interface ReportResponse {
  data: BookingReportData[] | LifeguardReportData[];
  totalCount: number;
  summary: ReportSummary;
}

export interface ReportSummary {
  totalRecords: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  // Enhanced booking-specific summary
  actualRevenue?: number; // Only from paid, non-cancelled bookings
  potentialRevenue?: number; // From confirmed/pending unpaid bookings
  lostRevenue?: number; // From cancelled bookings
  totalGrossRevenue?: number; // Sum of actual + potential
  conversionRate?: number; // Actual revenue / (actual + lost) revenue %
  averagePaidBookingValue?: number; // Average of only paid bookings
  paymentCollectionRate?: number; // Paid bookings / Total confirmed bookings %
  totalHours?: number;
  // Revenue health indicators
  revenueHealthStatus?: 'healthy' | 'attention' | 'concern';
  atRiskRevenue?: number; // Revenue from bookings pending payment >7 days
  // Legacy (deprecated but kept for compatibility)
  totalRevenue?: number; // Now equals actualRevenue
  averageBookingValue?: number; // Now equals averagePaidBookingValue
  // Lifeguard-specific summary
  totalActiveLifeguards?: number;
  totalAssignments?: number;
  averageAssignmentsPerLifeguard?: number;
  // Payroll: cancelled vs non-cancelled breakdown (prorated to the selected period)
  nonCancelledCount?: number;
  nonCancelledProratedHours?: number;
  nonCancelledProratedAmount?: number;
  cancelledCount?: number;
  cancelledProratedHours?: number;
  cancelledProratedAmount?: number;
  totalProratedHours?: number; // non-cancelled prorated hours (headline payroll figure)
}

export interface ReportFilters {
  type: ReportType;
  startDate: Date;
  endDate: Date;
  fields: BookingReportFields | LifeguardReportFields;
}

export interface ExportRequest {
  type: ReportType;
  startDate: string;
  endDate: string;
  fields: string[];
  format: ExportFormat;
}