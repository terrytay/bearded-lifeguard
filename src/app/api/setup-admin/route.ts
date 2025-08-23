import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

// One-time setup route to create admin user
// REMOVE THIS ROUTE AFTER CREATING ADMIN USER
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email verification
    });

    if (authError) {
      return NextResponse.json(
        { error: `Failed to create user: ${authError.message}` },
        { status: 400 }
      );
    }

    // Create profile with admin role
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          role: 'admin'
        }
      ]);

    if (profileError) {
      return NextResponse.json(
        { error: `Failed to create admin profile: ${profileError.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Admin user created successfully",
      userId: authData.user.id,
      email: authData.user.email
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Setup failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// IMPORTANT: Remove this route after creating your admin user for security