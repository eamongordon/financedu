import NextAuth from "next-auth"
import authConfig from "@/lib/auth/config"

export const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    if (req.auth) {
        // Redirect to account settings page if user logged in and trying to access login or signup page
        if ((pathname === '/login' || pathname === '/signup') && !searchParams.has('redirect')) {
            const redirectUrl = req.url.replace(pathname, '/account/settings');
            return Response.redirect(redirectUrl);
        }
    } else {
        // Redirect to login page if user not logged in and trying to access protected page
        if (pathname !== '/login') {
            const redirectUrl = req.url.replace(pathname, `/login?redirect=${encodeURIComponent(req.url)}`);
            return Response.redirect(redirectUrl);
        }
    }
})

export const config = {
    matcher: ["/manage", "/account/:path*", "/login", "/signup"]
}