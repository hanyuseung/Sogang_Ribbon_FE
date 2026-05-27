import { NextResponse, type NextRequest } from "next/server";
import { CANONICAL_SITE_URL } from "@/lib/site-url";

const CANONICAL_URL = new URL(CANONICAL_SITE_URL);

export function proxy(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.next();
  }

  const host = request.headers.get("host");
  if (!host || host === CANONICAL_URL.host) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = CANONICAL_URL.protocol;
  url.host = CANONICAL_URL.host;

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
