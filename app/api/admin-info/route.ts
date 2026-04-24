import { NextResponse } from 'next/server'
import { getVerifiedAdminUser } from '@/lib/admin-auth'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from('admin_info').select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener admin info' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getVerifiedAdminUser()
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from('admin_info')
      .upsert(
        {
          clave: body.clave,
          valor: body.valor,
        },
        { onConflict: 'clave' },
      )
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al guardar admin info' },
      { status: 500 },
    )
  }
}
