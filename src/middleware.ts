import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const newDomain = "prisma-editor.bahumaish.com";

  const url = new URL(
    request.nextUrl.pathname + request.nextUrl.search,
    `https://${newDomain}`
  );

  // Return 308 Permanent Redirect
  return NextResponse.redirect(url, { status: 308 });
}

// Add a matcher to run the middleware on all routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
