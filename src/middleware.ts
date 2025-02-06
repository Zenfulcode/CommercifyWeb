import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // const isLoginPage = request.nextUrl.pathname === '/admin/login';
    // const url = request.nextUrl.clone()

    // const token = request.cookies.get('token');
    // console.log('token', authService.isAuthenticated());
    // console.log('token', token);

    // if (isLoginPage) {
    //     if (authService.getToken()) {
    //         console.log('User is already authenticated, redirecting to dashboard');
    //         return NextResponse.redirect('/admin/dashboard');
    //     }
    //     return NextResponse.next();
    // }

    // if (!authService.isAuthenticated()) {
    //     url.pathname = '/admin/login';
    //     return NextResponse.redirect(url)
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*'
    ]
}