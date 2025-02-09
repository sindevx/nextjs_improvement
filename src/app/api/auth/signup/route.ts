import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.role || !body.password) {
      return NextResponse.json(
        { error: 'Name, email, role, and password are required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    
    // Create user in Supabase Auth 
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: {
          name: body.name,
          role: body.role
        }
      }
    });

    if (authError || !authData.user) {
      console.log('authError', authError);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user' },
        { status: 401 }
      );
    }

    // Insert user data into users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id, // Use the auth user id
          name: body.name,
          email: body.email,
          role: body.role,

          // Don't store password in the users table
          // created_at: new Date().toISOString(),
          // updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (userError) {
      console.log('userError', userError);
      // If user table insert fails, clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: 'Failed to create user record' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        name: body.name,
        email: body.email,
        role: body.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}