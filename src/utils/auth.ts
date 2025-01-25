import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function verifyToken(request: Request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return { user: null, error: 'No bearer token provided' };
    }

    const token = authHeader.split(' ')[1];
    try {
        // ไม่ต้องใช้ cookies() เลย เพราะเราจะใช้ token โดยตรง
        // แค่ตรวจสอบ token ว่าถูกต้องหรือไม่
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                ApiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            }
        });

        if (!response.ok) {
            return { user: null, error: 'Invalid token' };
        }

        const user = await response.json();
        return { user, error: null };
    } catch (error) {
        return { user: null, error: 'Invalid token' + error };
    }
}
