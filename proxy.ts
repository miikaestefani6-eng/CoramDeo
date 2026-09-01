import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login", "/assinatura"]);

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.has(pathname) || pathname.startsWith("/auth/") || pathname.startsWith("/assinatura/");

  if (!user && !isPublic) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/login") {
    const next = request.nextUrl.searchParams.get("next");
    const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (user && !isPublic) {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      const subscriptionUrl = request.nextUrl.clone();
      subscriptionUrl.pathname = "/assinatura";
      subscriptionUrl.search = "";
      return NextResponse.redirect(subscriptionUrl);
    }

    try {
      const entitlementResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/coram-v1-entitlements`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      if (!entitlementResponse.ok) {
        throw new Error(`Entitlement check failed with ${entitlementResponse.status}`);
      }

      const entitlement = await entitlementResponse.json();

      if (entitlement?.access_granted !== true) {
        const subscriptionUrl = request.nextUrl.clone();
        subscriptionUrl.pathname = "/assinatura";
        subscriptionUrl.search = "";
        subscriptionUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(subscriptionUrl);
      }
    } catch {
      const subscriptionUrl = request.nextUrl.clone();
      subscriptionUrl.pathname = "/assinatura";
      subscriptionUrl.search = "";
      subscriptionUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(subscriptionUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
