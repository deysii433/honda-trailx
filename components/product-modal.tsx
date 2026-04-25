'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Cuatrimoto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X, ShoppingCart, Cog, Palette, Gauge, Calendar, Check, Fuel, Tag } from 'lucide-react'

interface ProductModalProps {
  cuatrimoto: Cuatrimoto | null
  isOpen: boolean
  onClose: () => void
  onComprar: (cuatrimoto: Cuatrimoto) => void
}

export function ProductModal({ cuatrimoto, isOpen, onClose, onComprar }: ProductModalProps) {
  const [activeSlide, setActiveSlide] = useState(0)

  if (!cuatrimoto) return null

  const cleanDescripcion = (value: string) => {
    // Limpia texto basura accidental (sin romper descripciones normales)
    return value
      .replaceAll('{pjfaoifhlk<cnsd,', '')
      .replaceAll('pjfaoifhlk<cnsd,', '')
      .trim()
  }

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const getCategoriaLabel = (cat: string) => {
    const labels: Record<string, string> = {
      cuatrimoto: 'Cuatrimoto',
      moto: 'Moto',
      pioneer: 'Pioneer'
    }
    return labels[cat] || cat
  }

  const caracteristicas = [
    { icon: Tag, label: 'Categoría', value: getCategoriaLabel(cuatrimoto.categoria) },
    { icon: Cog, label: 'Tracción', value: cuatrimoto.traccion },
    { icon: Palette, label: 'Color', value: cuatrimoto.color },
    { icon: Gauge, label: 'Motor', value: `${cuatrimoto.motor}cc` },
    { icon: Calendar, label: 'Año', value: cuatrimoto.año },
    { icon: Fuel, label: 'Combustible', value: cuatrimoto.combustible },
  ]

  const beneficios = [
    'Garantía de 2 años Honda',
    'Servicio técnico especializado',
    'Refacciones originales Honda',
    'Sistema de apartado disponible',
    'Pago con tarjeta de crédito/débito',
  ]
  const ficha = cuatrimoto.fichaTecnica ?? {
    suspension: 'Doble horquilla independiente',
    transmision: 'Automatica / Manual segun version',
    velocidad: 'Hasta 110 km/h',
    peso: 'Aprox. 320 kg',
    tanque: '14 L',
    arranque: 'Electrico',
    enfriamiento: 'Liquido',
  }
  const gallery = cuatrimoto.imagenes && cuatrimoto.imagenes.length > 0
    ? cuatrimoto.imagenes
    : [cuatrimoto.imagen]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-card border-border max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-muted">
            <Carousel
              className="h-full"
              setApi={(api) => {
                if (!api) return
                const update = () => setActiveSlide(api.selectedScrollSnap())
                update()
                api.on('select', update)
              }}
            >
              <CarouselContent className="-ml-0 h-full">
                {gallery.map((image, idx) => (
                  <CarouselItem key={`${cuatrimoto.id}-${idx}`} className="pl-0 h-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={image}
                        alt={`${cuatrimoto.nombre} - imagen ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={image.startsWith('data:')}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {gallery.length > 1 && (
                <>
                  <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 h-8 w-8 border-border/70 bg-background/70 backdrop-blur-sm" />
                  <CarouselNext className="right-3 top-1/2 -translate-y-1/2 h-8 w-8 border-border/70 bg-background/70 backdrop-blur-sm" />
                </>
              )}
            </Carousel>
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              Honda
            </Badge>
            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {gallery.map((_, idx) => (
                  <span
                    key={`modal-dot-${idx}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeSlide ? 'w-5 bg-primary' : 'w-1.5 bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-card-foreground">
                {cuatrimoto.nombre}
              </DialogTitle>
            </DialogHeader>

            <div className="text-3xl font-bold text-primary mt-4">
              {formatPrice(cuatrimoto.precio)}
            </div>

            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
              cuatrimoto.disponible
                ? 'bg-green-500/15 border-green-500/30 text-green-400'
                : 'bg-red-500/15 border-red-500/30 text-red-400'
            }`}>
              <span className={`h-2 w-2 rounded-full ${cuatrimoto.disponible ? 'bg-green-500' : 'bg-red-500'}`} />
              {cuatrimoto.disponible ? 'Disponible para entrega inmediata' : 'Agotado temporalmente'}
            </div>

            <p className="text-muted-foreground mt-4 leading-relaxed">
              {cleanDescripcion(cuatrimoto.descripcion)}
            </p>

            {/* Características */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {caracteristicas.map((carac) => (
                <div
                  key={carac.label}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                >
                  <carac.icon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">{carac.label}</div>
                    <div className="font-semibold text-secondary-foreground">{carac.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ficha tecnica */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                FICHA TECNICA
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Suspension', value: ficha.suspension },
                  { label: 'Transmision', value: ficha.transmision },
                  { label: 'Velocidad', value: ficha.velocidad },
                  { label: 'Peso', value: ficha.peso },
                  { label: 'Tanque', value: ficha.tanque },
                  { label: 'Arranque', value: ficha.arranque },
                  { label: 'Enfriamiento', value: ficha.enfriamiento },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-border/70 bg-secondary/45 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-card-foreground mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficios */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                INCLUYE:
              </h4>
              <ul className="space-y-2">
                {beneficios.map((beneficio) => (
                  <li key={beneficio} className="flex items-center gap-2 text-sm text-card-foreground">
                    <Check className="w-4 h-4 text-green-500" />
                    {beneficio}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6">
              <Button
                size="lg"
                className="w-full"
                onClick={() => onComprar(cuatrimoto)}
                disabled={!cuatrimoto.disponible}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {cuatrimoto.disponible ? 'Comprar' : 'Producto Agotado'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
