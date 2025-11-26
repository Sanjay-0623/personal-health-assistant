import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // In the browser, Next.js injects NEXT_PUBLIC_ vars at build time
  // We need to access them directly, not through process.env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  console.log("[v0] Creating Supabase client with:", {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    keyLength: supabaseAnonKey?.length,
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables")
    throw new Error(
      "Missing Supabase environment variables. Please check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
    )
  }

  try {
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey)
    console.log("[v0] Supabase client created successfully")
    return client
  } catch (error) {
    console.error("[v0] Error creating Supabase client:", error)
    throw error
  }
}
