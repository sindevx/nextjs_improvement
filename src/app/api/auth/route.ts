// src/app/api/auth/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Login API
export async function POST(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }

  try {
    const { email, password } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
          { error: error.message },
          { status: 401 }
      );
    }

    return NextResponse.json({
      user: data.user,
      session: data.session
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
  }
}

// Logout API
export async function DELETE() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
        { error: 'Error during logout' },
        { status: 500 }
    );
  }
}

// Get current session
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session) {
      return NextResponse.json(
          { user: null },
          { status: 401 }
      );
    }

    // Get additional user data if needed
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
    }

    return NextResponse.json({
      user: {
        ...session.user,
        profile: userData || null
      }
    });

  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
        { error: 'Error checking session' },
        { status: 500 }
    );
  }
}