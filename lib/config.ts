export const config = {
  googleTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};
