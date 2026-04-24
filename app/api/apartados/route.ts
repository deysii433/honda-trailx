import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from('apartados')
      .select('*, clientes(nombre, telefono)')
      .order('fecha', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al obtener apartados' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServer()
    const body = await request.json()

    const { data: clienteData, error: clienteError } = await supabase
      .from('clientes')
      .upsert(
        {
          nombre: body.nombreCliente,
          telefono: body.telefono,
        },
        { onConflict: 'telefono' },
      )
      .select('id')
      .single()

    if (clienteError) {
      return NextResponse.json({ error: clienteError.message }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('apartados')
      .insert({
        cliente_id: clienteData.id,
        producto_id: body.productoId ?? null,
        nombre_producto: body.nombreProducto,
        fecha: body.fecha ?? new Date().toISOString(),
        monto_apartado: body.montoApartado,
        estado_pedido: body.estadoPedido ?? 'pendiente',
        tipo_compra: body.tipoCompra ?? 'apartar',
        metodo_pago: body.metodoPago ?? null,
        metodo_contacto: body.metodoContacto ?? null,
        mensaje: body.mensaje ?? null,
      })
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear apartado' },
      { status: 500 },
    )
  }
}
