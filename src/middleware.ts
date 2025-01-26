// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { i18n, type Locale } from '@/lib/i18n-config'

// export async function middleware(request: NextRequest) {
//   // เพิ่ม logging เพื่อดู request ที่เข้ามา
//   console.log('Incoming request:', {
//     pathname: request.nextUrl.pathname,
//     url: request.url
//   })

//   const pathname = request.nextUrl.pathname

//   // สร้าง function แยกสำหรับเช็ค public paths
//   const isPublicPath = (path: string) => {
//     const publicPaths = ['/login', '/api/auth']
//     return publicPaths.some(p => path.includes(p))
//   }

//   // ดึง locale ปัจจุบันจาก pathname
//   const currentLocale = pathname.split('/')[1]
//   console.log('Current locale:', currentLocale)

//   // เช็คว่าเป็น path ที่มี locale แล้วหรือไม่
//   const hasLocale = i18n.locales.includes(currentLocale as Locale)
//   console.log('Has locale:', hasLocale)

//   // ถ้ายังไม่มี locale ให้ redirect ไปยัง default locale
//   if (!hasLocale) {
//     const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
//     const acceptLanguage = request.headers.get('accept-language')?.split(',')[0].split('-')[0]
    
//     let locale: Locale = i18n.defaultLocale
//     if (cookieLocale && i18n.locales.includes(cookieLocale as Locale)) {
//       locale = cookieLocale as Locale
//     } else if (acceptLanguage && i18n.locales.includes(acceptLanguage as Locale)) {
//       locale = acceptLanguage as Locale
//     }

//     console.log('Redirecting to locale:', locale)
//     return NextResponse.redirect(
//       new URL(`/${locale}${pathname}`, request.url)
//     )
//   }

//   // ถ้ามี locale แล้ว ตรวจสอบ authentication
//   const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '')
//   console.log('Path without locale:', pathWithoutLocale)

//   // ถ้าเป็น public path ให้ผ่านไปได้เลย
//   if (isPublicPath(pathWithoutLocale)) {
//     console.log('Public path detected, allowing access')
//     return NextResponse.next()
//   }

//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req: request, res })

//   try {
//     const { data: { session }, error } = await supabase.auth.getSession()
//     console.log('Auth session:', session ? 'exists' : 'none')

//     if (error) {
//       console.error('Session error:', error)
//     }

//     // ถ้าไม่มี session และเป็น API route
//     if (!session && pathWithoutLocale.startsWith('/api')) {
//       console.log('Unauthorized API access')
//       return new NextResponse(
//         JSON.stringify({ error: 'unauthorized' }),
//         { status: 401, headers: { 'Content-Type': 'application/json' } }
//       )
//     }

//     // ถ้าไม่มี session และไม่ใช่ API route
//     if (!session && !pathWithoutLocale.startsWith('/api')) {
//       console.log('Redirecting to login')
//       return NextResponse.redirect(
//         new URL(`/${currentLocale}/login`, request.url)
//       )
//     }

//     return res
//   } catch (error) {
//     console.error('Middleware error:', error)
//     return NextResponse.next()
//   }
// }

// export const config = {
//   matcher: [
//     // จับทุก routes ยกเว้นไฟล์ static
//     '/((?!_next/static|_next/image|favicon.ico|public/).*)',
//   ],
// }

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n, type Locale } from '@/lib/i18n-config'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log('Current pathname:', pathname)

  // 1. ตรวจสอบว่าเป็น static path หรือไม่
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||  // เพิ่ม api routes
    pathname.includes('/favicon.ico') ||
    pathname.startsWith('/public/')
  ) {
    return NextResponse.next()
  }

  // 2. ฟังก์ชันตรวจสอบ public paths
  const isPublicPath = (path: string) => {
    const publicPaths = ['/login', '/signin', '/signup', '/api/auth']
    return publicPaths.some(p => path.endsWith(p))
  }

  // 3. ตรวจสอบ locale ในปัจจุบัน
  const currentLocale = pathname.split('/')[1]
  const hasLocale = i18n.locales.includes(currentLocale as Locale)
  console.log('Current locale:', currentLocale, 'Has locale:', hasLocale)

  // 4. ถ้าไม่มี locale, redirect ไปยัง default locale
  if (!hasLocale) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
    const locale = (cookieLocale as Locale) || i18n.defaultLocale
    
    // สร้าง URL ใหม่พร้อม locale
    const newUrl = new URL(request.url)
    newUrl.pathname = `/${locale}${pathname}`
    console.log('Redirecting to:', newUrl.toString())
    return NextResponse.redirect(newUrl)
  }

  // 5. จัดการ path หลังจากมี locale แล้ว
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '')
  console.log('Path without locale:', pathWithoutLocale)

  // 6. อนุญาต public paths
  if (isPublicPath(pathWithoutLocale)) {
    console.log('Public path accessed:', pathWithoutLocale)
    return NextResponse.next()
  }

  // 7. ตรวจสอบ authentication
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session status:', session ? 'authenticated' : 'unauthenticated')

    // ถ้าไม่มี session และไม่ใช่ public path
    if (!session) {
      const loginUrl = new URL(`/${currentLocale}/login`, request.url)
      console.log('Redirecting to login:', loginUrl.toString())
      return NextResponse.redirect(loginUrl)
    }

    return res
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.redirect(
      new URL(`/${currentLocale}/login`, request.url)
    )
  }
}

// ปรับ matcher pattern
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}