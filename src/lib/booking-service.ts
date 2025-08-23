import { supabaseAdmin, type Booking } from './supabase';
import { createClient } from './supabase/server';

export class BookingService {
  static async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    return data;
  }

  static async getBookingById(id: string): Promise<Booking | null> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new Error(`Failed to fetch booking: ${error.message}`);
    }

    return data || null;
  }

  static async getBookingByOrderId(orderId: string): Promise<Booking | null> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch booking: ${error.message}`);
    }

    return data || null;
  }

  static async getAllBookings(limit = 50, offset = 0): Promise<Booking[]> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return data;
  }

  static async updateBooking(id: string, updates: Partial<Omit<Booking, 'id' | 'created_at'>>): Promise<Booking> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }

    return data;
  }

  static async markAsViewed(id: string): Promise<Booking> {
    return this.updateBooking(id, { viewed_by_admin: true });
  }

  static async markAsUnviewed(id: string): Promise<Booking> {
    return this.updateBooking(id, { viewed_by_admin: false });
  }

  static async updatePaymentStatus(id: string, paymentStatus: Booking['payment_status'], status?: Booking['status']): Promise<Booking> {
    const updates: Partial<Booking> = { payment_status: paymentStatus };
    if (status) {
      updates.status = status;
    }
    return this.updateBooking(id, updates);
  }

  static async deleteBooking(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete booking: ${error.message}`);
    }
  }

  static async getUnviewedCount(): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('viewed_by_admin', false);

    if (error) {
      throw new Error(`Failed to get unviewed count: ${error.message}`);
    }

    return count || 0;
  }

  static async searchBookings(query: string): Promise<Booking[]> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .or(`customer_name.ilike.%${query}%,customer_email.ilike.%${query}%,order_id.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search bookings: ${error.message}`);
    }

    return data;
  }
}