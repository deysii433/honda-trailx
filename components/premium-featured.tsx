'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductModal } from '@/components/product-modal'
import { PurchaseModal } from '@/components/purchase-modal'
import { Cuatrimoto } from '@/lib/types'
import {
  ChevronRight,
  Shield,
  Award,
  Zap,
  ArrowRight,
  Gauge,
  Cog,
  Calendar,
} from 'lucide-react'

const categoriaMeta: Record<string, { label: string; tagline: string; accent: string }> = {
  cuatrimoto: {
    label: 'Cuatrimoto',
    tagline: 'Domina cualquier terreno',
    accent: 'from-red-600 to-red-700',
  },
  pioneer: {
    label: 'Pioneer',
    tagline: 'Potencia de trabajo sin límites',
    accent: 'from-amber-600 to-amber-700',
  },
  moto: {
    label: 'Moto',
    tagline: 'Adrenalina sobre dos ruedas',
    accent: 'from-blue-600 to-blue-700',
  },
}

export function PremiumFeatured() {
  const [productos, setProductos] = useState<Cuatrimoto[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Cuatrimoto | null>(null)
  const [purchaseProduct, setPurchaseProduct] = useState<Cuatrimoto | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/api/productos', { cache: 'no-store' })
        if (!response.ok) return
        const data = (await response.json()) as Cuatrimoto[]
        setProductos(Array.isArray(data) ? data : [])
      } catch {
        setProductos([])
      }
    }
    void fetchProductos()
  }, [])

  const premiumProducts = [...productos]
    .sort((a, b) => (b.visitas ?? 0) - (a.visitas ?? 0))
    .slice(0, 3)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-product-id')
            if (id) {
              setVisibleCards(prev => new Set([...prev, id]))
            }
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const cards = sectionRef.current?.querySelectorAll('[data-product-id]')
    cards?.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [premiumProducts.length])

  const handleVerMas = (producto: Cuatrimoto) => {
    setSelectedProduct(producto)
    setIsProductModalOpen(true)
  }

  const handleComprar = (producto: Cuatrimoto) => {
    setIsProductModalOpen(false)
    setPurchaseProduct(producto)
    setIsPurchaseModalOpen(true)
  }

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-semibold rounded-full bg-primary/15 text-primary border border-primary/25">
            <Award className="w-4 h-4" />
            Modelos Premium
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Lo mejor de{' '}
            <span className="gradient-text">Honda</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Nuestra selección premium de vehículos con el más alto rendimiento,
            tecnología avanzada y garantía Honda oficial.
          </p>
        </div>

        {/* Premium Cards */}
        <div className="space-y-8">
          {premiumProducts.map((producto, index) => {
            const meta = categoriaMeta[producto.categoria] || categoriaMeta.cuatrimoto
            const isVisible = visibleCards.has(producto.id)
            const isReversed = index % 2 !== 0

            return (
              <div
                key={producto.id}
                data-product-id={producto.id}
                className={`group transition-all duration-700 ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-500">
                  {/* Top accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${meta.accent}`} />

                  <div className={`flex flex-col lg:flex-row ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Image Section */}
                    <div className="relative lg:w-1/2 aspect-[16/10] lg:aspect-auto overflow-hidden">
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized={producto.imagen.startsWith('data:')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-card/40" />

                      {/* Category badge on image */}
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-card/90 text-card-foreground border border-border backdrop-blur-sm px-3 py-1 text-sm">
                          {meta.label}
                        </Badge>
                      </div>

                      {/* Price overlay on image */}
                      <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8">
                        <p className="text-sm text-muted-foreground font-medium">Desde</p>
                        <p className="text-3xl sm:text-4xl font-bold text-foreground">
                          {formatPrice(producto.precio)}
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="space-y-5">
                        {/* Title & Tagline */}
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
                            {producto.nombre}
                          </h3>
                          <p className="text-muted-foreground mt-1 font-medium">
                            {meta.tagline}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed">
                          {producto.descripcion}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2.5 p-3 bg-secondary/80 rounded-lg">
                            <Gauge className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Motor</p>
                              <p className="text-sm font-semibold text-secondary-foreground">{producto.motor}cc</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 p-3 bg-secondary/80 rounded-lg">
                            <Cog className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Tracción</p>
                              <p className="text-sm font-semibold text-secondary-foreground">{producto.traccion}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 p-3 bg-secondary/80 rounded-lg">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Año</p>
                              <p className="text-sm font-semibold text-secondary-foreground">{producto.año}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 p-3 bg-secondary/80 rounded-lg">
                            <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Color</p>
                              <p className="text-sm font-semibold text-secondary-foreground">{producto.color}</p>
                            </div>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full">
                            <Shield className="w-3.5 h-3.5" />
                            Garantía 2 años
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            <Award className="w-3.5 h-3.5" />
                            100% Original
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                            Apartado disponible
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button
                            size="lg"
                            className="group/btn"
                            onClick={() => handleComprar(producto)}
                            disabled={!producto.disponible}
                          >
                            {producto.disponible ? 'Apartar Ahora' : 'Agotado'}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => handleVerMas(producto)}
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link href="/catalogo">
            <Button size="lg" variant="outline" className="group">
              Explorar todos los modelos
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        cuatrimoto={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onComprar={handleComprar}
      />

      <PurchaseModal
        cuatrimoto={purchaseProduct}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </section>
  )
}
