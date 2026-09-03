import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isStaffRoute =
    pathname.startsWith('/staff') &&
    !pathname.startsWith('/staff/login');

  if (!user && isStaffRoute) {
    const url = request.nextUrl.clone();

    url.pathname = '/staff/login';

    if (pathname === '/staff/dashboard') {
      url.searchParams.set('from', 'dashboard');
    } else if (pathname === '/staff/scanner') {
      url.searchParams.set('from', 'scanner');
    }

    return NextResponse.redirect(url);
  }

  if (user && pathname === '/staff/login') {
    const from = request.nextUrl.searchParams.get('from');

    const url = request.nextUrl.clone();

    url.pathname =
      from === 'dashboard'
        ? '/staff/dashboard'
        : '/staff/scanner';

    url.search = '';

    return NextResponse.redirect(url);
  }

  return response;
}