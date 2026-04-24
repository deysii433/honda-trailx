'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Vehiculo, CategoriaVehiculo } from './types'

// Datos iniciales con cuatrimotos, motos y pioneers
const productosIniciales: Vehiculo[] = [
  // Cuatrimotos
  {
    id: '1',
    nombre: 'Honda TRX450R',
    categoria: 'cuatrimoto',
    precio: 185000,
    imagen: '/images/atv-1.jpg',
    color: 'Rojo',
    traccion: '4x2',
    motor: '450',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'La Honda TRX450R es una cuatrimoto deportiva diseñada para rendimiento extremo. Perfecta para carreras y terrenos difíciles.',
    fichaTecnica: {
      suspension: 'Delantera y trasera deportiva ajustable',
      transmision: 'Manual de 5 velocidades',
      velocidad: 'Hasta 120 km/h',
      peso: '184 kg',
      tanque: '10.5 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  {
    id: '2',
    nombre: 'Honda TRX700XX',
    categoria: 'cuatrimoto',
    precio: 210000,
    imagen: '/images/atv-2.jpg',
    color: 'Negro',
    traccion: '4x2',
    motor: '700',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'La Honda TRX700XX ofrece potencia y control excepcionales. Ideal para pilotos experimentados que buscan adrenalina.',
    fichaTecnica: {
      suspension: 'Independiente de largo recorrido',
      transmision: 'Manual de 5 velocidades con reversa',
      velocidad: 'Hasta 125 km/h',
      peso: '229 kg',
      tanque: '13.5 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  {
    id: '3',
    nombre: 'Honda TRX450ER',
    categoria: 'cuatrimoto',
    precio: 175000,
    imagen: '/images/atv-3.jpg',
    color: 'Verde',
    traccion: '4x2',
    motor: '450',
    año: '2023',
    combustible: 'Gasolina',
    descripcion: 'La Honda TRX450ER combina velocidad y maniobrabilidad. Diseñada para conquistar cualquier terreno.',
    fichaTecnica: {
      suspension: 'Showa de alto rendimiento',
      transmision: 'Manual de 5 velocidades',
      velocidad: 'Hasta 118 km/h',
      peso: '190 kg',
      tanque: '10.2 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  {
    id: '4',
    nombre: 'Honda FourTrax Foreman',
    categoria: 'cuatrimoto',
    precio: 320000,
    imagen: '/images/atv-4.jpg',
    color: 'Azul',
    traccion: '4x4',
    motor: '520',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'La Honda FourTrax Foreman es la cuatrimoto utilitaria más potente. Perfecta para trabajo pesado y aventuras extremas.',
    fichaTecnica: {
      suspension: 'Independiente con eje trasero solido',
      transmision: 'Automatico DCT de 5 velocidades',
      velocidad: 'Hasta 102 km/h',
      peso: '336 kg',
      tanque: '14.7 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  {
    id: '5',
    nombre: 'Honda Rubicon',
    categoria: 'cuatrimoto',
    precio: 285000,
    imagen: '/images/atv-5.jpg',
    color: 'Naranja',
    traccion: '4x4',
    motor: '520',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'La Honda Rubicon ofrece versatilidad incomparable. Perfecta tanto para trabajo como para recreación.',
    fichaTecnica: {
      suspension: 'Totalmente independiente IRS',
      transmision: 'Automatico DCT con modo manual',
      velocidad: 'Hasta 105 km/h',
      peso: '337 kg',
      tanque: '16.7 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  {
    id: '6',
    nombre: 'Honda FourTrax Rancher',
    categoria: 'cuatrimoto',
    precio: 145000,
    imagen: '/images/atv-6.jpg',
    color: 'Blanco',
    traccion: '4x4',
    motor: '420',
    año: '2023',
    combustible: 'Gasolina',
    descripcion: 'La Honda FourTrax Rancher es confiable y duradera. Ideal para rancho, granja y terrenos rurales.',
    fichaTecnica: {
      suspension: 'Delantera independiente y trasera basculante',
      transmision: 'Automatico de 5 velocidades',
      velocidad: 'Hasta 95 km/h',
      peso: '281 kg',
      tanque: '14.3 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  // Pioneer (Side by Side)
  {
    id: '7',
    nombre: 'Honda Pioneer 1000',
    categoria: 'pioneer',
    precio: 485000,
    imagen: '/images/pioneer-1.jpg',
    color: 'Rojo',
    traccion: '4x4',
    motor: '999',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'El Honda Pioneer 1000 es el vehículo utilitario side-by-side más versátil. Motor de 999cc, capacidad para 3 personas y sistema I-4WD.',
    fichaTecnica: {
      suspension: 'Independiente en las 4 ruedas',
      transmision: 'Automatico DCT de 6 velocidades',
      velocidad: 'Hasta 108 km/h',
      peso: '694 kg',
      tanque: '30 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  {
    id: '8',
    nombre: 'Honda Pioneer 700',
    categoria: 'pioneer',
    precio: 385000,
    imagen: '/images/pioneer-2.jpg',
    color: 'Negro',
    traccion: '4x4',
    motor: '675',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'El Honda Pioneer 700 combina potencia y maniobrabilidad. Perfecto para senderos estrechos y trabajo en terrenos difíciles.',
    fichaTecnica: {
      suspension: 'Independiente delantera y trasera',
      transmision: 'Automatico con convertidor de par',
      velocidad: 'Hasta 95 km/h',
      peso: '577 kg',
      tanque: '30 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  {
    id: '9',
    nombre: 'Honda Pioneer 520',
    categoria: 'pioneer',
    precio: 295000,
    imagen: '/images/pioneer-3.jpg',
    color: 'Verde Camo',
    traccion: '4x4',
    motor: '518',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'El Honda Pioneer 520 es compacto pero capaz. Ideal para propiedades medianas y senderos de tamaño reducido.',
    fichaTecnica: {
      suspension: 'Doble horquilla con eje trasero independiente',
      transmision: 'Automatico de 5 velocidades',
      velocidad: 'Hasta 85 km/h',
      peso: '483 kg',
      tanque: '15.4 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  // Motos
  {
    id: '10',
    nombre: 'Honda CRF450R',
    categoria: 'moto',
    precio: 195000,
    imagen: '/images/moto-1.jpg',
    color: 'Rojo',
    traccion: 'Trasera',
    motor: '450',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'La Honda CRF450R es la moto de motocross más ganadora. Motor de 450cc con la tecnología más avanzada para competencia.',
    fichaTecnica: {
      suspension: 'Horquilla invertida Showa y monoamortiguador',
      transmision: 'Manual de 5 velocidades',
      velocidad: 'Hasta 145 km/h',
      peso: '111 kg',
      tanque: '6.3 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  },
  {
    id: '11',
    nombre: 'Honda CRF250R',
    categoria: 'moto',
    precio: 165000,
    imagen: '/images/moto-2.jpg',
    color: 'Rojo/Blanco',
    traccion: 'Trasera',
    motor: '250',
    año: '2024',
    combustible: 'Gasolina',
    descripcion: 'La Honda CRF250R ofrece rendimiento de clase mundial en un paquete más manejable. Perfecta para pilotos intermedios y avanzados.',
    fichaTecnica: {
      suspension: 'Horquilla invertida Showa y monoamortiguador Pro-Link',
      transmision: 'Manual de 5 velocidades',
      velocidad: 'Hasta 132 km/h',
      peso: '104 kg',
      tanque: '6.3 L',
      arranque: 'Electrico',
      enfriamiento: 'Liquido',
    },
    disponible: true
  }
]

interface ProductosState {
  productos: Vehiculo[]
  agregarProducto: (producto: Omit<Vehiculo, 'id'>) => Vehiculo
  actualizarProducto: (id: string, datos: Partial<Vehiculo>) => void
  eliminarProducto: (id: string) => void
  obtenerProductosPorCategoria: (categoria: CategoriaVehiculo | 'todas') => Vehiculo[]
}

export const useProductosStore = create<ProductosState>()(
  persist(
    (set, get) => ({
      productos: productosIniciales,
      
      agregarProducto: (producto) => {
        const nuevoProducto: Vehiculo = {
          ...producto,
          id: Date.now().toString(),
        }
        set((state) => ({
          productos: [...state.productos, nuevoProducto]
        }))
        return nuevoProducto
      },
      
      actualizarProducto: (id, datos) => {
        set((state) => ({
          productos: state.productos.map((p) =>
            p.id === id ? { ...p, ...datos } : p
          )
        }))
      },
      
      eliminarProducto: (id) => {
        set((state) => ({
          productos: state.productos.filter((p) => p.id !== id)
        }))
      },
      
      obtenerProductosPorCategoria: (categoria) => {
        const productos = get().productos
        if (categoria === 'todas') return productos
        return productos.filter((p) => p.categoria === categoria)
      }
    }),
    {
      name: 'honda-productos-storage',
    }
  )
)
