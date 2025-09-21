import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { publicRoute, type TPublicRoute, type TRoutePaths } from "@/config";

const generateRegexFromRoutes = (routes: TPublicRoute) => {
  const patterns: string[] = [];

  const convertPathToRegex = (path: string) => {
    return (
      path
        .replace(/\[\[\.{3}slug\]\]/g, "(/[^/]+|.*|.*)") // Optional dynamic segments
        .replace(/\[\.{3}slug\]/g, "(/[^/]+)*") // Dynamic segments
        .replace(/\[slug\]/g, "([^/]+)") // Single dynamic segment
        .replace(/\//g, "\\/") + // Escape slashes
      "?"
    ); // Optional trailing segment
  };

  for (const base in routes) {
    routes[base as TRoutePaths].forEach((path) => {
      patterns.push(convertPathToRegex(path));
    });
  }

  return new RegExp(`^(${patterns.join("|")})$`, "i");
};

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

  const publicPathnameRegex = generateRegexFromRoutes(publicRoute);

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  // if (isPublicPage) return intlMiddleware(req);

  if ((!session || !session?.user.token) && !isPublicPage) {
    return NextResponse.redirect(
      new URL(`/?callbackUrl=${encodeURIComponent(reqUrl?.pathname)}`, req.url)
    );
  }
  const callbackUrl = reqUrl.searchParams.get("callbackUrl");

  if (callbackUrl) {
    return NextResponse.redirect(
      new URL(decodeURIComponent(callbackUrl), req.url)
    );
  }
  return NextResponse.next();
});
