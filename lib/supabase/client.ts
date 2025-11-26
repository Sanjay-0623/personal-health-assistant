import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl,
    })
    throw new Error(
      "Missing Supabase environment variables. Please check your environment configuration in the Vercel dashboard.",
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
