import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateAdminToken, getTokenFromRequest } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    const token = getTokenFromRequest(request);
    if (!token || !validateAdminToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
