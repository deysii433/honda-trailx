export type CategoriaVehiculo = 'cuatrimoto' | 'moto' | 'pioneer'

export interface Vehiculo {
  id: string
  nombre: string
  categoria: CategoriaVehiculo
  precio: number
  imagen: string
  color: string
  traccion: string
  motor: string // Solo el número ej: "420", "450", "520", "700"
  año: string
  combustible: string // Ej: "Gasolina", "Sin plomo"
  descripcion: string
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
