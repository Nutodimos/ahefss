import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseAnonKey = rawKey !== 'your-supabase-anon-key-here' && rawKey !== 'your-anon-key-here' ? rawKey.trim() : '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { success: false, error: 'Missing Supabase environment variables' },
      { status: 500 }
    );
  }

  try {
    // Ping Supabase PostgREST endpoint to execute a real query against the database.
    // This resets the 7-day inactivity pause counter on Supabase.
    const response = await fetch(
      `${supabaseUrl}/rest/v1/academic_sessions?select=id&limit=1`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, status: response.status, error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Supabase pinged successfully. Inactivity timer reset.',
      timestamp: new Date().toISOString(),
      rowsFound: Array.isArray(data) ? data.length : 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown ping error' },
      { status: 500 }
    );
  }
}
