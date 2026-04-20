'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, Phone } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-atv.jpg"
          alt="Cuatrimoto en acción"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-16">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold rounded-full bg-primary/20 text-primary border border-primary/30">
            Distribuidor Autorizado Honda
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Conquista{' '}
            <span className="gradient-text">cualquier terreno</span>{' '}
            con vehículos Honda
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
            Descubre nuestra colección exclusiva de cuatrimotos, motos y Pioneer Honda originales. 
            Sistema de apartado disponible con facilidades de pago.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/catalogo">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 group glow-primary">
                Ver Catálogo
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                <Phone className="mr-2 w-5 h-5" />
                Contáctanos
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div className="text-3xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Años de experiencia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Clientes satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Honda original</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-2.5 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
