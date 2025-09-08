import { supabaseAdmin, type Lifeguard, type Booking } from './supabase';
import { SingaporeTime } from './singapore-time';

export class LifeguardService {
  // Basic CRUD Operations
  static async createLifeguard(lifeguard: Omit<Lifeguard, 'id' | 'created_at' | 'updated_at'>): Promise<Lifeguard> {
    const { data, error } = await supabaseAdmin
      .from('lifeguards')
      .insert(lifeguard)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create lifeguard: ${error.message}`);
    }

    return data;
  }

  static async getLifeguardById(id: string): Promise<Lifeguard | null> {
    const { data, error } = await supabaseAdmin
      .from('lifeguards')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new Error(`Failed to fetch lifeguard: ${error.message}`);
    }

    return data || null;
  }

  static async getAllLifeguards(limit = 50, offset = 0): Promise<Lifeguard[]> {
    const { data, error } = await supabaseAdmin
      .from('lifeguards')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch lifeguards: ${error.message}`);
    }

    return data;
  }

  static async updateLifeguard(id: string, updates: Partial<Omit<Lifeguard, 'id' | 'created_at'>>): Promise<Lifeguard> {
    const { data, error } = await supabaseAdmin
      .from('lifeguards')
      .update({ ...updates, updated_at: SingaporeTime.now().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update lifeguard: ${error.message}`);
    }

    return data;
  }

  static async deleteLifeguard(id: string): Promise<void> {
    // First check if lifeguard is assigned to any active bookings
    const { data: bookingsWithLifeguard } = await supabaseAdmin
      .from('bookings')
      .select('id, order_id, status')
      .contains('lifeguards_assigned', [id])
      .in('status', ['pending', 'confirmed', 'paid']);

    if (bookingsWithLifeguard && bookingsWithLifeguard.length > 0) {
      throw new Error(`Cannot delete lifeguard: assigned to ${bookingsWithLifeguard.length} active booking(s)`);
    }

    const { error } = await supabaseAdmin
      .from('lifeguards')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete lifeguard: ${error.message}`);
    }
  }

  // Search and filter operations
  static async searchLifeguards(query: string): Promise<Lifeguard[]> {
    const { data, error } = await supabaseAdmin
      .from('lifeguards')
      .select('*')
      .or(`name.ilike.%${query}%,contact_number.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search lifeguards: ${error.message}`);
    }

    return data;
  }

  static async getActiveLifeguards(): Promise<Lifeguard[]> {
    const { data, error } = await supabaseAdmin
      .from('lifeguards')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch active lifeguards: ${error.message}`);
    }

    return data;
  }

  static async getLifeguardStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    assigned: number;
  }> {
    // Get total counts
    const { data: allLifeguards, error } = await supabaseAdmin
      .from('lifeguards')
      .select('id, is_active');

    if (error) {
      throw new Error(`Failed to fetch lifeguard stats: ${error.message}`);
    }

    const total = allLifeguards.length;
    const active = allLifeguards.filter(lg => lg.is_active).length;
    const inactive = total - active;

    // Get assigned count (lifeguards currently assigned to active bookings)
    const { data: activeBookings } = await supabaseAdmin
      .from('bookings')
      .select('lifeguards_assigned')
      .in('status', ['pending', 'confirmed', 'paid']);

    const assignedLifeguardIds = new Set<string>();
    activeBookings?.forEach(booking => {
      if (booking.lifeguards_assigned && Array.isArray(booking.lifeguards_assigned)) {
        booking.lifeguards_assigned.forEach(id => assignedLifeguardIds.add(id));
      }
    });

    return {
      total,
      active,
      inactive,
      assigned: assignedLifeguardIds.size,
    };
  }

  // Assignment operations
  static async assignLifeguardsToBooking(bookingId: string, lifeguardIds: string[]): Promise<Booking> {
    // Validate that all lifeguard IDs exist and are active
    const { data: lifeguards, error: lifeguardsError } = await supabaseAdmin
      .from('lifeguards')
      .select('id, name, is_active')
      .in('id', lifeguardIds);

    if (lifeguardsError) {
      throw new Error(`Failed to validate lifeguards: ${lifeguardsError.message}`);
    }

    if (!lifeguards || lifeguards.length !== lifeguardIds.length) {
      throw new Error('Some lifeguard IDs are invalid');
    }

    const inactiveLifeguards = lifeguards.filter(lg => !lg.is_active);
    if (inactiveLifeguards.length > 0) {
      throw new Error(`Cannot assign inactive lifeguards: ${inactiveLifeguards.map(lg => lg.name).join(', ')}`);
    }

    // Get the booking to validate assignment count
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('lifeguards, lifeguards_assigned')
      .eq('id', bookingId)
      .single();

    if (bookingError) {
      throw new Error(`Failed to fetch booking: ${bookingError.message}`);
    }

    if (lifeguardIds.length > booking.lifeguards) {
      throw new Error(`Cannot assign ${lifeguardIds.length} lifeguards to booking that requires only ${booking.lifeguards}`);
    }

    // Update the booking with assigned lifeguards
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ 
        lifeguards_assigned: lifeguardIds,
        updated_at: SingaporeTime.now().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign lifeguards to booking: ${error.message}`);
    }

    return data;
  }

  static async unassignLifeguardFromBooking(bookingId: string, lifeguardId: string): Promise<Booking> {
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('lifeguards_assigned')
      .eq('id', bookingId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch booking: ${fetchError.message}`);
    }

    const currentAssignments = booking.lifeguards_assigned || [];
    const updatedAssignments = currentAssignments.filter(id => id !== lifeguardId);

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ 
        lifeguards_assigned: updatedAssignments,
        updated_at: SingaporeTime.now().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to unassign lifeguard from booking: ${error.message}`);
    }

    return data;
  }

  static async getLifeguardsByBooking(bookingId: string): Promise<Lifeguard[]> {
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('lifeguards_assigned')
      .eq('id', bookingId)
      .single();

    if (bookingError) {
      throw new Error(`Failed to fetch booking: ${bookingError.message}`);
    }

    if (!booking.lifeguards_assigned || booking.lifeguards_assigned.length === 0) {
      return [];
    }

    const { data: lifeguards, error } = await supabaseAdmin
      .from('lifeguards')
      .select('*')
      .in('id', booking.lifeguards_assigned)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch assigned lifeguards: ${error.message}`);
    }

    return lifeguards;
  }

  static async getAvailableLifeguardsForBooking(bookingId: string): Promise<Lifeguard[]> {
    // Get all active lifeguards
    const { data: allActiveLifeguards, error: lifeguardsError } = await supabaseAdmin
      .from('lifeguards')
      .select('*')
      .eq('is_active', true);

    if (lifeguardsError) {
      throw new Error(`Failed to fetch lifeguards: ${lifeguardsError.message}`);
    }

    // Get the target booking details
    const { data: targetBooking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('start_datetime, end_datetime, lifeguards_assigned')
      .eq('id', bookingId)
      .single();

    if (bookingError) {
      throw new Error(`Failed to fetch booking: ${bookingError.message}`);
    }

    // Get overlapping bookings to find conflicting assignments
    const { data: overlappingBookings, error: overlappingError } = await supabaseAdmin
      .from('bookings')
      .select('lifeguards_assigned')
      .neq('id', bookingId) // Exclude the current booking
      .or(`and(start_datetime.lte.${targetBooking.end_datetime},end_datetime.gte.${targetBooking.start_datetime})`)
      .in('status', ['confirmed', 'paid']);

    if (overlappingError) {
      throw new Error(`Failed to fetch overlapping bookings: ${overlappingError.message}`);
    }

    // Collect all lifeguard IDs that are busy during this time
    const busyLifeguardIds = new Set<string>();
    overlappingBookings?.forEach(booking => {
      if (booking.lifeguards_assigned && Array.isArray(booking.lifeguards_assigned)) {
        booking.lifeguards_assigned.forEach(id => busyLifeguardIds.add(id));
      }
    });

    // Filter out busy lifeguards, but include currently assigned ones
    const currentlyAssigned = new Set(targetBooking.lifeguards_assigned || []);
    const availableLifeguards = allActiveLifeguards.filter(lifeguard => 
      !busyLifeguardIds.has(lifeguard.id) || currentlyAssigned.has(lifeguard.id)
    );

    return availableLifeguards.sort((a, b) => a.name.localeCompare(b.name));
  }
}