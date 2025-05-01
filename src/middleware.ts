import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("authjs.session-token")?.value;
  const { pathname } = req.nextUrl;

  if (sessionToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!sessionToken && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
