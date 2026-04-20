'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { ProductModal } from '@/components/product-modal'
import { PurchaseModal } from '@/components/purchase-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Cuatrimoto, CATEGORIAS, CategoriaVehiculo } from '@/lib/types'
import { useProductosStore } from '@/lib/store'
import { Search, X, SlidersHorizontal, Bike, Truck, Sparkles, Shield, CreditCard } from 'lucide-react'

const CATEGORIA_ICONS: Record<CategoriaVehiculo, React.ElementType> = {
  cuatrimoto: Bike,
  moto: Bike,
  pioneer: Truck,
}

export default function CatalogoPage() {
  const productos = useProductosStore((state) => state.productos)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaVehiculo | 'todas'>('todas')
  const [selectedProduct, setSelectedProduct] = useState<Cuatrimoto | null>(null)
  const [purchaseProduct, setPurchaseProduct] = useState<Cuatrimoto | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    return productos.filter(producto => {
      const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.motor.includes(searchTerm) ||
        producto.año.includes(searchTerm)
      
      const matchesCategoria = selectedCategoria === 'todas' || producto.categoria === selectedCategoria
      
      return matchesSearch && matchesCategoria
    })
  }, [searchTerm, selectedCategoria, productos])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { todas: productos.length }
    CATEGORIAS.forEach(cat => {
      counts[cat.value] = productos.filter(p => p.categoria === cat.value).length
    })
    return counts
  }, [productos])

  const handleVerMas = (producto: Cuatrimoto) => {
    setSelectedProduct(producto)
    setIsProductModalOpen(true)
  }

  const handleComprar = (producto: Cuatrimoto) => {
    setIsProductModalOpen(false)
    setPurchaseProduct(producto)
    setIsPurchaseModalOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategoria('todas')
  }

  const hasActiveFilters = searchTerm || selectedCategoria !== 'todas'

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30">
              100% Honda Original
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Catálogo <span className="gradient-text">Honda</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra selección exclusiva de vehículos Honda. 
              Cuatrimotos, motos y Pioneer con sistema de apartado disponible.
            </p>
          </div>

          {/* Promo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Garantía Honda</h3>
                <p className="text-sm text-muted-foreground">2 años de garantía oficial</p>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Sistema de Apartado</h3>
                <p className="text-sm text-muted-foreground">Enganche y mensualidades</p>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">100% Originales</h3>
                <p className="text-sm text-muted-foreground">Refacciones y servicio</p>
              </div>
            </Card>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Button
              variant={selectedCategoria === 'todas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategoria('todas')}
              className="min-w-[100px]"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Todas ({categoryCounts.todas})
            </Button>
            {CATEGORIAS.map((cat) => {
              const Icon = CATEGORIA_ICONS[cat.value]
              return (
                <Button
                  key={cat.value}
                  variant={selectedCategoria === cat.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategoria(cat.value)}
                  className="min-w-[100px]"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.label} ({categoryCounts[cat.value]})
                </Button>
              )
            })}
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, color, motor o año..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex justify-center items-center gap-2 mt-4">
                {selectedCategoria !== 'todas' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Categoría: {CATEGORIAS.find(c => c.value === selectedCategoria)?.label}
                    <button onClick={() => setSelectedCategoria('todas')}>
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Búsqueda: {searchTerm}
                    <button onClick={() => setSearchTerm('')}>
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  Limpiar todo
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Mostrando {filteredProducts.length} de {productos.length} vehículos Honda
          </p>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((producto) => (
                <ProductCard
                  key={producto.id}
                  cuatrimoto={producto}
                  onVerMas={handleVerMas}
                  onComprar={handleComprar}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">
                No se encontraron vehículos con tu búsqueda.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contáctanos y te ayudamos a encontrar el vehículo Honda perfecto para ti
            </p>
            <Button size="lg" asChild>
              <a href="/contacto">
                Contáctanos
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer />

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
    </main>
  )
}
