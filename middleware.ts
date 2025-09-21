import { NextResponse } from "next/server";
import { auth } from "@/auth";


export const config = {
  matcher: [
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!api|_next/static|.*\\..*|_next/image|favicon.ico).*)",
  ],
};

export const middleware = auth(async (req) => {
  const session = await auth();

  const reqUrl = new URL(req.url);


  const isPrivatePage = reqUrl.pathname.includes("/dashboard");

  // if (isPublicPage) return intlMiddleware(req);
  if (!session && isPrivatePage) {
    return NextResponse.redirect(
      new URL(`/auth/?callbackUrl=${encodeURIComponent(reqUrl?.pathname)}`, req.url)
    );
  }
  
  return NextResponse.next();
});
