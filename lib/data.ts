import { Vehiculo } from './types'

export const cuatrimotosIniciales: Vehiculo[] = [
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
    disponible: true
  }
]

export const informacionNegocio = {
  nombre: 'Honda Cuatrimotos México',
  direccion: 'Tejupilco de Hidalgo, Estado de México, México',
  telefono: '+52 777 457 4497',
  whatsapp: '7774574497',
  facebook: 'https://facebook.com/hondacuatrimotosmexico',
  email: 'ventas@hondacuatrimotos.mx',
  horario: 'Lunes a Sábado: 9:00 AM - 7:00 PM',
  coordenadas: {
    lat: 19.3910,
    lng: -99.1787
  }
}
