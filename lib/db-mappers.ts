import { FichaTecnica, TipoEntrega, Vehiculo } from './types'

type ProductoRow = {
  id: string
  nombre: string
  categoria: 'cuatrimoto' | 'moto' | 'pioneer'
  precio: number
  imagen: string
  imagenes: string[] | null
  color: string
  traccion: string
  motor: string
  año: string
  combustible: string
  descripcion: string
  ficha_tecnica: FichaTecnica | null
  tipo_entrega: TipoEntrega | null
  visitas: number | null
  disponible: boolean
}

export function mapProductoRowToVehiculo(row: ProductoRow): Vehiculo {
  return {
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria,
    precio: row.precio,
    imagen: row.imagen,
    imagenes: row.imagenes ?? [],
    color: row.color,
    traccion: row.traccion,
    motor: row.motor,
    año: row.año,
    combustible: row.combustible,
    descripcion: row.descripcion,
    fichaTecnica: row.ficha_tecnica ?? undefined,
    tipoEntrega: row.tipo_entrega ?? undefined,
    visitas: row.visitas ?? undefined,
    disponible: row.disponible,
  }
}
