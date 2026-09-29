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

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  /*
   * Hanya Dashboard yang membutuhkan login.
   *
   * Scanner bersifat public.
   */
  const isDashboardRoute =
    pathname.startsWith('/staff/dashboard');

  /*
   * Jika belum login lalu membuka Dashboard,
   * arahkan ke login.
   */
  if (!user && isDashboardRoute) {
    const url = request.nextUrl.clone();

    url.pathname = '/staff/login';
    url.searchParams.set(
      'from',
      'dashboard'
    );

    return NextResponse.redirect(url);
  }

  /*
   * Jika user sudah login lalu membuka halaman login,
   * arahkan ke Dashboard.
   *
   * Scanner tidak ikut dilindungi auth.
   */
  if (
    user &&
    pathname === '/staff/login'
  ) {
    const from =
      request.nextUrl.searchParams.get(
        'from'
      );

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