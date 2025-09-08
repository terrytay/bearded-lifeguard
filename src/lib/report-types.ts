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
  { key: 'total_revenue_generated', label: 'Total Revenue Generated', type: 'currency', computed: true, group: 'computed', description: 'Sum of amounts from assigned bookings' },
  { key: 'avg_assignment_duration', label: 'Average Assignment Duration', type: 'number', computed: true, group: 'computed', description: 'Average hours per assignment' },
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