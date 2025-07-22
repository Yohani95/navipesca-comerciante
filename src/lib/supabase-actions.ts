import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Server-side Supabase instance specifically for Server Actions
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  return createServerActionClient({ cookies: () => cookieStore })
} 