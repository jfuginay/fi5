import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicPaths = ['/', '/login', '/register'];

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Create a Supabase client
  const supabase = createServerSupabaseClient({
    req: {
      headers: Object.fromEntries(request.headers),
      cookies: Object.fromEntries(request.cookies.entries()),
    },
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users to login page
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from login/register pages
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}