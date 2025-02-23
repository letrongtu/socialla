import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/auth", "/notfound"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPublicPath = publicPaths.includes(pathname);

  const isLoggedIn =
    Boolean(request.cookies.get("token")?.value) &&
    Boolean(request.cookies.get("userId")?.value);

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (isLoggedIn) {
    return NextResponse.next();
  }

  const authUrl = new URL("/auth", request.url);

  return NextResponse.redirect(authUrl);
}
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
