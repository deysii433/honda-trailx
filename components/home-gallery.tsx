'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { SlidersHorizontal } from 'lucide-react'

const GALLERY_IMAGES = [
  '/images/hero-atv.jpg',
  '/images/atv-1.jpg',
  '/images/atv-2.jpg',
  '/images/atv-3.jpg',
  '/images/atv-4.jpg',
  '/images/atv-5.jpg',
  '/images/atv-6.jpg',
]

export function HomeGallery() {
  const carouselApiRef = useRef<unknown>(null)
  const autoplayTimerRef = useRef<number | null>(null)
  const [active, setActive] = useState(0)

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      window.clearInterval(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }
  }

  const startAutoplay = () => {
    if (autoplayTimerRef.current) return
    autoplayTimerRef.current = window.setInterval(() => {
      const api = carouselApiRef.current as { scrollNext?: () => void } | null
      api?.scrollNext?.()
    }, 2600)
  }

  useEffect(() => {
    startAutoplay()
    return stopAutoplay
  }, [])

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-3 mb-8">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
            Galería
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance flex items-center justify-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Cuatrimotos en acción
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Distintos terrenos, misma potencia Honda. Conoce su potencial en movimiento.
          </p>
        </div>

        <Card
          className="overflow-hidden border-border/70 bg-card/60 soft-shadow"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          <div className="relative">
            <Carousel
              className="h-full"
              setApi={(api) => {
                if (!api) return
                carouselApiRef.current = api
                const update = () => setActive(api.selectedScrollSnap())
                update()
                api.on('select', update)
              }}
              opts={{ loop: true }}
            >
              <CarouselContent className="-ml-0">
                {GALLERY_IMAGES.map((src, idx) => (
                  <CarouselItem key={`${src}-${idx}`} className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="relative aspect-[16/10] w-full bg-muted">
                      <Image
                        src={src}
                        alt={`Galería Honda ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx < 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 h-9 w-9 border-border/70 bg-background/70 backdrop-blur-sm" />
              <CarouselNext className="right-3 top-1/2 -translate-y-1/2 h-9 w-9 border-border/70 bg-background/70 backdrop-blur-sm" />
            </Carousel>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {GALLERY_IMAGES.map((_, idx) => (
                <span
                  key={`home-dot-${idx}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === active ? 'w-6 bg-primary' : 'w-1.5 bg-foreground/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

