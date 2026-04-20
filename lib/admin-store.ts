// Store simple para el panel de administrador
// En un entorno de producción, esto estaría conectado a una base de datos

import { Cuatrimoto } from './types'
import { cuatrimotosIniciales } from './data'

// Contraseña del admin (en producción, esto debería estar hasheado y en una BD)
export const ADMIN_PASSWORD = 'admin123'

// Esta función simula verificar la contraseña
export function verificarContrasena(contrasena: string): boolean {
  return contrasena === ADMIN_PASSWORD
}

// Estado inicial de los productos
let productos: Cuatrimoto[] = [...cuatrimotosIniciales]

export function obtenerProductos(): Cuatrimoto[] {
  return productos
}

export function agregarProducto(producto: Omit<Cuatrimoto, 'id'>): Cuatrimoto {
  const nuevoProducto: Cuatrimoto = {
    ...producto,
    id: Date.now().toString(),
  }
  productos = [...productos, nuevoProducto]
  return nuevoProducto
}

export function actualizarProducto(id: string, datosActualizados: Partial<Cuatrimoto>): Cuatrimoto | null {
  const index = productos.findIndex(p => p.id === id)
  if (index === -1) return null
  
  productos[index] = { ...productos[index], ...datosActualizados }
  return productos[index]
}

export function eliminarProducto(id: string): boolean {
  const longitudAnterior = productos.length
  productos = productos.filter(p => p.id !== id)
  return productos.length < longitudAnterior
}
