'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { ProductModal } from '@/components/product-modal'
import { PurchaseModal } from '@/components/purchase-modal'
import { Cuatrimoto } from '@/lib/types'
import { useProductosStore } from '@/lib/store'
import { ChevronRight } from 'lucide-react'

export function FeaturedProducts() {
  const productos = useProductosStore((state) => state.productos)
  const [selectedProduct, setSelectedProduct] = useState<Cuatrimoto | null>(null)
  const [purchaseProduct, setPurchaseProduct] = useState<Cuatrimoto | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  // Get featured products: one from each category
  const featuredProducts = [
    productos.find(p => p.categoria === 'cuatrimoto'),
    productos.find(p => p.categoria === 'pioneer'),
    productos.find(p => p.categoria === 'moto'),
  ].filter(Boolean).slice(0, 3) as Cuatrimoto[]

  const handleVerMas = (cuatrimoto: Cuatrimoto) => {
    setSelectedProduct(cuatrimoto)
    setIsProductModalOpen(true)
  }

  const handleComprar = (cuatrimoto: Cuatrimoto) => {
    setIsProductModalOpen(false)
    setPurchaseProduct(cuatrimoto)
    setIsPurchaseModalOpen(true)
  }

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold rounded-full bg-primary/20 text-primary border border-primary/30">
            Destacados
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Nuestros vehículos más populares
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre los vehículos Honda favoritos de nuestros clientes. Cuatrimotos, Pioneer y Motos seleccionadas por su rendimiento y calidad.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((cuatrimoto) => (
            <ProductCard
              key={cuatrimoto.id}
              cuatrimoto={cuatrimoto}
              onVerMas={handleVerMas}
              onComprar={handleComprar}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/catalogo">
            <Button size="lg" variant="outline" className="group">
              Ver catálogo completo
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
