'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Cuatrimoto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Eye, ShoppingCart, Cog, Palette, Gauge, Calendar, Fuel } from 'lucide-react'

interface ProductCardProps {
  cuatrimoto: Cuatrimoto
  onVerMas: (cuatrimoto: Cuatrimoto) => void
  onComprar: (cuatrimoto: Cuatrimoto) => void
  featuredTag?: string
}

export function ProductCard({ cuatrimoto, onVerMas, onComprar, featuredTag }: ProductCardProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const carouselApiRef = useRef<unknown>(null)
  const autoplayTimerRef = useRef<number | null>(null)

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const gallery = (
    cuatrimoto.imagenes && cuatrimoto.imagenes.length > 0 ? cuatrimoto.imagenes : [cuatrimoto.imagen]
  ).filter((img): img is string => typeof img === 'string' && img.length > 0)

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      window.clearInterval(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
  }

  const startAutoplay = () => {
    if (gallery.length <= 1) return
    if (autoplayTimerRef.current) return
    autoplayTimerRef.current = window.setInterval(() => {
      const api = carouselApiRef.current as { scrollNext?: () => void } | null
      api?.scrollNext?.()
    }, 2000)
  }

  useEffect(() => stopAutoplay, [])

  return (
    <Card
      className="group bg-card border-border overflow-hidden hover:border-primary/50 transition-all duration-300 card-hover soft-shadow"
      onMouseEnter={startAutoplay}
      onMouseLeave={stopAutoplay}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Carousel
          className="h-full"
          setApi={(api) => {
            if (!api) return
            carouselApiRef.current = api
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
                    alt={`${cuatrimoto.nombre} - vista ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-35" />
        
        {/* Category & Brand Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge className="bg-primary text-primary-foreground">
            Honda
          </Badge>
          <Badge variant="secondary" className="bg-card/90 text-card-foreground capitalize">
            {cuatrimoto.categoria}
          </Badge>
        </div>

        {/* Featured Tag */}
        {featuredTag && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground shadow-md animate-pulse">
            {featuredTag}
          </Badge>
        )}

        {/* Availability Badge */}
        {!cuatrimoto.disponible && (
          <Badge 
            variant="destructive"
            className={`absolute ${featuredTag ? 'top-11' : 'top-3'} right-3`}
          >
            Agotado
          </Badge>
        )}

        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {gallery.map((_, idx) => (
              <span
                key={`dot-${cuatrimoto.id}-${idx}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide ? 'w-5 bg-primary' : 'w-1.5 bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
            {cuatrimoto.nombre}
          </h3>
        </div>

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
            Comprar
          </Button>
        </div>
      </div>
    </Card>
  )
}
