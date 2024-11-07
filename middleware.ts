import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.AUTH_SECRET;

export async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname, origin } = req.nextUrl;

  if (pathname.startsWith("/admin") && (!session || session.role !== "ADMIN")) {
    return NextResponse.redirect(origin);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
