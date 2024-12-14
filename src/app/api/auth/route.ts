// src/app/api/auth/route.ts
import { createClient } from '@supabase/supabase-js';

import { NextRequest, NextResponse } from 'next/server';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

// Login API
export async function POST(request: NextRequest) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  
    try {
      const { email, password } = await request.json();
  
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        return new NextResponse(
          JSON.stringify({ error: error.message }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      console.log('data', data)
      return new NextResponse(
        JSON.stringify({
          user: data.user,
          session: data.session
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
// Logout API
export async function DELETE(request: NextRequest) {
  try {
    
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session) {
      return NextResponse.json(
        { error: 'ไม่พบ session ที่ active' },
        { status: 401 }
      );
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    // ล้าง cookies
    const response = NextResponse.json({
      message: 'ออกจากระบบสำเร็จ'
    });

    return response;

  } catch (error) {
    console.error('Server error during logout:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    );
  }
}

// Get current session
export async function GET(request: NextRequest) {
  try {
    
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    // ดึงข้อมูลผู้ใช้เพิ่มเติม
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
    console.error('Server error fetching session:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการตรวจสอบ session' },
      { status: 500 }
    );
  }
}