import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export async function middleware(request: NextRequest) {
    // ตรวจสอบ path ที่ไม่ต้องการ authentication
    const publicPaths = ['/login', '/api/auth'];
    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isPublicPath) {
        return NextResponse.next();
    }

    const res = NextResponse.next();
    const supabase = createMiddlewareClient({req: request, res});

    const {data: {session}, error} = await supabase.auth.getSession();

    if (error) {
        console.error('Session error:', error);
    }

    // ถ้าไม่มี session และเป็น API route
    if (!session && request.nextUrl.pathname.startsWith('/api')) {
        return new NextResponse(
            JSON.stringify({error: 'unauthorized'}),
            {status: 401, headers: {'Content-Type': 'application/json'}}
        );
    }

    // ถ้าไม่มี session และเป็น UI route
    if (!session && !request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return res;
}

export const config = {
    matcher: [
        // จับทุก routes ยกเว้นไฟล์ static
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};