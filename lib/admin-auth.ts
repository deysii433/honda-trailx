import type { User } from '@supabase/supabase-js'
import { createSupabaseAuthServer } from './supabase/auth-server'

export function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
}

export function isEmailAllowedAdmin(email: string | undefined): boolean {
  if (!email) return false
  const allowed = parseAdminEmails()
  if (allowed.length === 0) return false
  return allowed.includes(email.trim().toLowerCase())
}

/** Usuario de Supabase Auth con correo autorizado en `ADMIN_EMAILS`. */
export async function getVerifiedAdminUser(): Promise<User | null> {
  const supabase = await createSupabaseAuthServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user?.email) return null
  if (!isEmailAllowedAdmin(user.email)) return null
  return user
}
