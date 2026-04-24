import type { CategoriaVehiculo } from './types'

const CATEGORIAS: CategoriaVehiculo[] = ['cuatrimoto', 'moto', 'pioneer']

export type ProductoValidationError = { field: string; message: string }

function parseFichaTecnica(body: Record<string, unknown>): Record<string, unknown> | null {
  const ft = body.ficha_tecnica ?? body.fichaTecnica
  if (ft == null) return null
  if (typeof ft === 'object' && !Array.isArray(ft)) return ft as Record<string, unknown>
  return null
}

/** Fila solo con columnas de `public.productos` (PostgREST no acepta claves extra). */
export function bodyToProductoRow(
  body: unknown,
): { row: Record<string, unknown> } | { error: ProductoValidationError } {
  if (!body || typeof body !== 'object') {
    return { error: { field: 'body', message: 'Cuerpo inválido' } }
  }
  const b = body as Record<string, unknown>

  const categoria = b.categoria as string
  if (!CATEGORIAS.includes(categoria as CategoriaVehiculo)) {
    return { error: { field: 'categoria', message: 'Categoría no válida' } }
  }

  const precio = Number(b.precio)
  if (!Number.isFinite(precio) || precio < 0 || !Number.isInteger(precio)) {
    return { error: { field: 'precio', message: 'Precio inválido' } }
  }

  const nombre = String(b.nombre ?? '').trim()
  if (!nombre) return { error: { field: 'nombre', message: 'Nombre requerido' } }

  const imagen = String(b.imagen ?? '').trim()
  if (!imagen) return { error: { field: 'imagen', message: 'Imagen requerida' } }

  let imagenes: string[]
  if (Array.isArray(b.imagenes)) {
    imagenes = b.imagenes.filter((x): x is string => typeof x === 'string' && x.length > 0)
  } else {
    imagenes = []
  }
  if (imagenes.length === 0) imagenes = [imagen]

  const color = String(b.color ?? '').trim()
  if (!color) return { error: { field: 'color', message: 'Color requerido' } }

  const traccion = String(b.traccion ?? '').trim()
  if (!traccion) return { error: { field: 'traccion', message: 'Tracción requerida' } }

  const motor = String(b.motor ?? '').trim()
  if (!motor) return { error: { field: 'motor', message: 'Motor requerido' } }

  const año = String(b.año ?? '').trim()
  if (!año) return { error: { field: 'año', message: 'Año requerido' } }

  const combustible = String(b.combustible ?? '').trim()
  if (!combustible) return { error: { field: 'combustible', message: 'Combustible requerido' } }

  const descripcion = String(b.descripcion ?? '').trim()
  if (!descripcion) return { error: { field: 'descripcion', message: 'Descripción requerida' } }

  const disponible = typeof b.disponible === 'boolean' ? b.disponible : true

  const row = {
    nombre,
    categoria,
    precio,
    imagen,
    imagenes,
    color,
    traccion,
    motor,
    año,
    combustible,
    descripcion,
    ficha_tecnica: parseFichaTecnica(b),
    disponible,
  }
  return { row }
}
