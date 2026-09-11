import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasActiveCoramAccess } from "@/lib/access";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublic = pathname === "/site" || pathname === "/login" || pathname === "/assinatura" || pathname === "/termos" || pathname === "/privacidade" || pathname.startsWith("/auth/");

  // Public marketing/auth screens do not need a Supabase session lookup just to render.
  // Keep /site session-aware so signed-in users still return to the product instead of marketing.
  if (isPublic && pathname !== "/site") return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { cookies: { getAll() { return request.cookies.getAll(); }, setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: { user } } = await supabase.auth.getUser();

  if (pathname === "/app") {
    if (!user) return NextResponse.redirect(new URL("/login?next=/", request.url));
    const { allowed } = await hasActiveCoramAccess();
    if (!allowed) return NextResponse.redirect(new URL("/assinatura?next=/", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!user && pathname === "/") return NextResponse.redirect(new URL("/site", request.url));
  if (!user && !isPublic) { const loginUrl = request.nextUrl.clone(); loginUrl.pathname = "/login"; loginUrl.search = ""; loginUrl.searchParams.set("next", pathname); return NextResponse.redirect(loginUrl); }
  if (user && pathname === "/site") return NextResponse.redirect(new URL("/", request.url));
  if (user && !isPublic) { const { allowed } = await hasActiveCoramAccess(); if (!allowed) { const subscriptionUrl = request.nextUrl.clone(); subscriptionUrl.pathname = "/assinatura"; subscriptionUrl.search = ""; subscriptionUrl.searchParams.set("next", pathname); return NextResponse.redirect(subscriptionUrl); } }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"] };
