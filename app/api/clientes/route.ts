import { NextResponse } from 'next/server'
import { getVerifiedAdminUser } from '@/lib/admin-auth'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const admin = await getVerifiedAdminUser()
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener clientes' },
      { status: 500 },
    )
  }
}
