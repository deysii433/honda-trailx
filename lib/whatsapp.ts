import { Vehiculo } from './types'
import { informacionNegocio } from './data'

export function openVehicleWhatsApp(vehiculo: Vehiculo) {
  const message = `Hola, me interesa apartar este vehiculo Honda:

Modelo: ${vehiculo.nombre}
Categoria: ${vehiculo.categoria}
Motor: ${vehiculo.motor}cc
Ano: ${vehiculo.año}

Podrian compartirme informacion para continuar con el apartado, formas de pago y disponibilidad?`

  const whatsappUrl = `https://wa.me/52${informacionNegocio.whatsapp}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}
