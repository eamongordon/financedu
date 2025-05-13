import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    if (sessionCookie) {
        // Redirect to account settings page if user logged in and trying to access login or signup page
        if ((pathname === '/login' || pathname === '/signup') && !searchParams.has('redirect')) {
            const redirectUrl = request.url.replace(pathname, '/account/settings');
            return NextResponse.redirect(redirectUrl);
        }
    } else {
        // Redirect to login page if user not logged in and trying to access protected page
        if (pathname !== '/login' && pathname !== '/signup') {
            const redirectUrl = request.url.replace(pathname, `/login?redirect=${encodeURIComponent(request.url)}`);
            return Response.redirect(redirectUrl);
        }

    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/manage", "/account/:path*", "/login", "/signup", "/chat"]
}