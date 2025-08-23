-- Create the bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id VARCHAR NOT NULL UNIQUE,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  customer_phone VARCHAR NOT NULL,
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  hours INTEGER NOT NULL,
  lifeguards INTEGER NOT NULL DEFAULT 1,
  service_type VARCHAR NOT NULL,
  custom_service TEXT,
  remarks TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'completed', 'cancelled')),
  payment_status VARCHAR NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  viewed_by_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create the profiles table for admin authentication
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role VARCHAR NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admin can manage all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;

-- Create policies for bookings table
CREATE POLICY "Admin can manage all bookings" ON bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow public read access to profiles (temporary for debugging)
CREATE POLICY "Allow public read on profiles" ON profiles
  FOR SELECT USING (true);

-- Create an admin user profile
-- Replace 'your-user-uuid' with the actual UUID from Authentication > Users
-- You can get this by creating a user first in the Supabase Dashboard
-- INSERT INTO profiles (id, role) VALUES ('your-user-uuid', 'admin');