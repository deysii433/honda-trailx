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
