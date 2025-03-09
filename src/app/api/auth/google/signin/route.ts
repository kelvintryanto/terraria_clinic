import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: 'Google Client ID not configured' },
        { status: 500 }
      );
    }

    // Use the origin from the environment or default to localhost
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create the Google OAuth URL - using the same redirect URI that was working before
    // This should match exactly what's configured in Google Cloud Console
    // IMPORTANT: Update this URL to match exactly what's in your Google Cloud Console
    // const redirectUri = `${origin}/api/auth/google/callback`;

    // Use the exact redirect URI that's configured in Google Cloud Console
    let redirectUri = 'http://localhost:3000/api/auth/google/callback';

    // For production, we'll use the terrariavet.com domain if the origin matches
    if (origin.includes('terrariavet.com')) {
      redirectUri = 'https://terrariavet.com/api/auth/google/callback';
    }

    // Log the redirect URI for debugging
    console.log('Using redirect URI:', redirectUri);

    const scope = 'email profile';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&access_type=offline&prompt=consent`;

    // Redirect to Google OAuth
    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error('Error redirecting to Google:', error);
    return NextResponse.redirect(
      new URL(
        '/login?error=Failed to redirect to Google',
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      )
    );
  }
}
