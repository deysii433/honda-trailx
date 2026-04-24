import { NextResponse } from 'next/server'
import { getVerifiedAdminUser } from '@/lib/admin-auth'
import { mapProductoRowToVehiculo } from '@/lib/db-mappers'
import { bodyToProductoRow } from '@/lib/productos-payload'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json((data ?? []).map(mapProductoRowToVehiculo))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener productos' },
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
    const mapped = bodyToProductoRow(body)
    if ('error' in mapped) {
      return NextResponse.json({ error: mapped.error.message, field: mapped.error.field }, { status: 400 })
    }

    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from('productos').insert(mapped.row).select('*').single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(mapProductoRowToVehiculo(data), { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear producto' },
      { status: 500 },
    )
  }
}
