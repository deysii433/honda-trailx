export type CategoriaVehiculo = 'cuatrimoto' | 'moto' | 'pioneer'

export type TipoEntrega = 'inmediata' | 'pedido'

export interface FichaTecnica {
  suspension: string
  transmision: string
  velocidad: string
  peso: string
  tanque: string
  arranque: string
  enfriamiento: string
}

export interface Vehiculo {
  id: string
  nombre: string
  categoria: CategoriaVehiculo
  precio: number
  imagen: string
  imagenes?: string[]
  color: string
  traccion: string
  motor: string // Solo el número ej: "420", "450", "520", "700"
  año: string
  combustible: string // Ej: "Gasolina", "Sin plomo"
  descripcion: string
  fichaTecnica?: FichaTecnica
  tipoEntrega?: TipoEntrega
  visitas?: number
  disponible: boolean
}

// Alias para compatibilidad
export type Cuatrimoto = Vehiculo

export interface FormularioCompra {
  nombre: string
  telefono: string
  metodoContacto: 'whatsapp' | 'llamada'
  enganche: string
  vehiculoId: string
  mensaje?: string
}

export const CATEGORIAS: { value: CategoriaVehiculo; label: string }[] = [
  { value: 'cuatrimoto', label: 'Cuatrimoto' },
  { value: 'moto', label: 'Moto' },
  { value: 'pioneer', label: 'Pioneer' },
]
