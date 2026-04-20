'use client'

import Image from 'next/image'
import { Cuatrimoto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, ShoppingCart, Cog, Palette, Gauge, Calendar, Fuel, Zap } from 'lucide-react'

interface ProductCardProps {
  cuatrimoto: Cuatrimoto
  onVerMas: (cuatrimoto: Cuatrimoto) => void
  onComprar: (cuatrimoto: Cuatrimoto) => void
}

export function ProductCard({ cuatrimoto, onVerMas, onComprar }: ProductCardProps) {
  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <Card className="group bg-card border-border overflow-hidden hover:border-primary/50 transition-all duration-300 card-hover">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={cuatrimoto.imagen}
          alt={cuatrimoto.nombre}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized={cuatrimoto.imagen.startsWith('data:')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        
        {/* Category & Brand Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge className="bg-primary text-primary-foreground">
            Honda
          </Badge>
          <Badge variant="secondary" className="bg-card/90 text-card-foreground capitalize">
            {cuatrimoto.categoria}
          </Badge>
        </div>

        {/* Availability Badge */}
        {!cuatrimoto.disponible && (
          <Badge 
            variant="destructive"
            className="absolute top-3 right-3"
          >
            Agotado
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
          {cuatrimoto.nombre}
        </h3>
        
        <div className="text-2xl font-bold text-primary mt-2">
          {formatPrice(cuatrimoto.precio)}
        </div>

        {/* Features Bubbles */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm text-secondary-foreground">
            <Cog className="w-4 h-4" />
            <span>{cuatrimoto.traccion}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm text-secondary-foreground">
            <Palette className="w-4 h-4" />
            <span>{cuatrimoto.color}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm text-secondary-foreground">
            <Gauge className="w-4 h-4" />
            <span>{cuatrimoto.motor}cc</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm text-secondary-foreground">
            <Calendar className="w-4 h-4" />
            <span>{cuatrimoto.año}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm text-secondary-foreground">
            <Fuel className="w-4 h-4" />
            <span>{cuatrimoto.combustible}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onVerMas(cuatrimoto)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver más
          </Button>
          <Button
            className="flex-1"
            onClick={() => onComprar(cuatrimoto)}
            disabled={!cuatrimoto.disponible}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Apartar
          </Button>
        </div>
      </div>
    </Card>
  )
}
