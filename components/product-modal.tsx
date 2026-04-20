'use client'

import Image from 'next/image'
import { Cuatrimoto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  if (!cuatrimoto) return null

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-card border-border overflow-hidden">
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
            <Image
              src={cuatrimoto.imagen}
              alt={cuatrimoto.nombre}
              fill
              className="object-cover"
              unoptimized={cuatrimoto.imagen.startsWith('data:')}
            />
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              Honda
            </Badge>
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

            <p className="text-muted-foreground mt-4 leading-relaxed">
              {cuatrimoto.descripcion}
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
                {cuatrimoto.disponible ? 'Apartar Ahora' : 'Producto Agotado'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
