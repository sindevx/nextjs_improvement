import { createClient } from '@supabase/supabase-js';

import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const id = params.id;
      const body = await request.json();
  
      // Validate required fields
      if (!body.name || !body.email || !body.role) {
        return NextResponse.json(
          { error: 'Name, email, and role are required' },
          { status: 400 }
        );
      }
  
      const { data, error } = await supabase
        .from('users')
        .update({
          name: body.name,
          password: body.password,
          email: body.email,
          role: body.role
        })
        .eq('id', id)
        .select()
        .single();
  
      if (error) {
        console.error('Supabase error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      if (!data) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('Server error:', (error as Error).message);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  export async function DELETE(
    { params }: { params: { id: string } }
  ) {
    try {
      const id = params.id;
  
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
  
      if (error) {
        console.error('Supabase error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Server error:', (error as Error).message);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }