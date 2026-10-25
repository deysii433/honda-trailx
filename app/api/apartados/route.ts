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

// PATCH: solo el admin puede cambiar el estado de una solicitud
const ESTADOS = ['pendiente', 'confirmado', 'cancelado', 'liquidado']

export async function PATCH(request: Request) {
  try {
    const admin = await getVerifiedAdminUser()
    if (!admin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const id = String(body?.id ?? '')
    const estado = String(body?.estado ?? '')
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }
    if (!ESTADOS.includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const supabase = getSupabaseServer()
    const { data, error } = await supabase
      .from('apartados')
      .update({ estado_pedido: estado })
      .eq('id', id)
      .select('id, estado_pedido')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el estado' },
      { status: 500 },
    )
  }
}

// ---- Límites contra spam ----
const MAX_POR_TELEFONO = 3 // solicitudes por teléfono…
const VENTANA_TELEFONO_MIN = 60 // …en esta cantidad de minutos
const MAX_GLOBAL = 30 // solicitudes en total (todas las personas)…
const VENTANA_GLOBAL_MIN = 10 // …en esta cantidad de minutos

const TIPOS_COMPRA = ['apartar', 'comprar']
const METODOS_PAGO = ['efectivo', 'transferencia', 'deposito']
const METODOS_CONTACTO = ['whatsapp', 'llamada']
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function rechazar(mensaje: string, status = 400) {
  return NextResponse.json({ error: mensaje }, { status })
}

function haceMinutos(min: number) {
  return new Date(Date.now() - min * 60_000).toISOString()
}

// POST: público (lo usan los clientes), pero valida todo y limita el spam
export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return rechazar('Solicitud inválida')
    }
    if (!body || typeof body !== 'object') return rechazar('Solicitud inválida')

    // 1) Validar datos del cliente
    const nombre = String(body.nombreCliente ?? '').trim().replace(/\s+/g, ' ')
    if (nombre.length < 2 || nombre.length > 80) return rechazar('Nombre inválido')

    // Solo dígitos; acepta 10 dígitos o con lada 52 al inicio (12 dígitos)
    let telefono = String(body.telefono ?? '').replace(/\D/g, '')
    if (telefono.length === 12 && telefono.startsWith('52')) telefono = telefono.slice(2)
    if (telefono.length !== 10) return rechazar('Teléfono inválido (deben ser 10 dígitos)')

    const tipoCompra = TIPOS_COMPRA.includes(String(body.tipoCompra)) ? String(body.tipoCompra) : 'apartar'
    const metodoPago = METODOS_PAGO.includes(String(body.metodoPago)) ? String(body.metodoPago) : null
    const metodoContacto = METODOS_CONTACTO.includes(String(body.metodoContacto))
      ? String(body.metodoContacto)
      : null
    const mensaje = body.mensaje ? String(body.mensaje).trim().slice(0, 500) || null : null

    const productoId = String(body.productoId ?? '')
    if (!UUID_RE.test(productoId)) return rechazar('Producto inválido')

    const supabase = getSupabaseServer()

    // 2) El producto, su nombre y su precio salen de la base de datos (no del navegador)
    const { data: producto, error: productoError } = await supabase
      .from('productos')
      .select('id, nombre, precio, disponible')
      .eq('id', productoId)
      .maybeSingle()
    if (productoError) return rechazar(productoError.message, 500)
    if (!producto) return rechazar('Producto no encontrado', 404)
    if (!producto.disponible) return rechazar('Este producto no está disponible')

    // Monto: si compra, el precio completo; si aparta, entre 1 y el precio total
    let monto: number
    if (tipoCompra === 'comprar') {
      monto = producto.precio
    } else {
      monto = Math.round(Number(body.montoApartado) * 100) / 100
      if (!Number.isFinite(monto) || monto <= 0 || monto > producto.precio) {
        return rechazar('Monto de apartado inválido')
      }
    }

    // 3) Límite general: frena avalanchas de solicitudes (aunque usen teléfonos distintos)
    const { count: totalReciente, error: globalError } = await supabase
      .from('apartados')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', haceMinutos(VENTANA_GLOBAL_MIN))
    if (globalError) return rechazar(globalError.message, 500)
    if ((totalReciente ?? 0) >= MAX_GLOBAL) {
      return rechazar('Estamos recibiendo muchas solicitudes. Intenta de nuevo en unos minutos.', 429)
    }

    // 4) Límite por teléfono
    const { data: clienteExistente, error: buscarError } = await supabase
      .from('clientes')
      .select('id')
      .eq('telefono', telefono)
      .maybeSingle()
    if (buscarError) return rechazar(buscarError.message, 500)

    if (clienteExistente) {
      const { count: delCliente, error: cuentaError } = await supabase
        .from('apartados')
        .select('id', { count: 'exact', head: true })
        .eq('cliente_id', clienteExistente.id)
        .gte('created_at', haceMinutos(VENTANA_TELEFONO_MIN))
      if (cuentaError) return rechazar(cuentaError.message, 500)
      if ((delCliente ?? 0) >= MAX_POR_TELEFONO) {
        return rechazar('Ya recibimos varias solicitudes de este teléfono. Te contactaremos pronto.', 429)
      }
    }

    // 5) Guardar cliente (o actualizar su nombre) y la solicitud
    const { data: clienteData, error: clienteError } = await supabase
      .from('clientes')
      .upsert({ nombre, telefono }, { onConflict: 'telefono' })
      .select('id')
      .single()
    if (clienteError) return rechazar(clienteError.message, 500)

    const { data, error } = await supabase
      .from('apartados')
      .insert({
        cliente_id: clienteData.id,
        producto_id: producto.id,
        nombre_producto: producto.nombre,
        fecha: new Date().toISOString(), // la fecha la pone el servidor
        monto_apartado: monto,
        estado_pedido: 'pendiente', // siempre entra como pendiente
        tipo_compra: tipoCompra,
        metodo_pago: metodoPago,
        metodo_contacto: metodoContacto,
        mensaje,
      })
      .select('*')
      .single()

    if (error) return rechazar(error.message, 500)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al crear apartado' },
      { status: 500 },
    )
  }
}
