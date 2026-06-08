import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing Supabase environment variables");
      return supabaseResponse;
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    let authUser: typeof user | null = null;
    const { data: { user }, error } = await supabase.auth.getUser();
    authUser = user;
    
    if (error) {
      // Auth session missing is expected for unauthenticated users - not an error
      if (error.message.includes("session missing") || error.message.includes("invalid") || error.message.includes("expired")) {
        console.log("[v0] No active session (expected for unauthenticated users)");
      } else {
        console.error("[v0] Auth error:", error.message);
      }
      // Continue without user - let routing handle unauthenticated access
      authUser = null;
    }

    const { pathname } = request.nextUrl;

    const isAuthPage = pathname.startsWith("/auth");
    const isPublicPage = pathname === "/";

    if (!authUser && !isAuthPage && !isPublicPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    if (authUser && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("[v0] Middleware error:", error instanceof Error ? error.message : String(error));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
