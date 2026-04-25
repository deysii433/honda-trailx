'use client'

import { useEffect, useMemo, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { ProductModal } from '@/components/product-modal'
import { PurchaseModal } from '@/components/purchase-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Skeleton } from '@/components/ui/skeleton'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Cuatrimoto, CATEGORIAS, CategoriaVehiculo } from '@/lib/types'
import { Search, X, SlidersHorizontal, Bike, Truck, Sparkles, Shield, CreditCard, Filter, Gauge, Calendar, Tag, CircleCheck, CircleX, Funnel, Zap } from 'lucide-react'

const CATEGORIA_ICONS: Record<CategoriaVehiculo, React.ElementType> = {
  cuatrimoto: Bike,
  moto: Bike,
  pioneer: Truck,
}

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Cuatrimoto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaVehiculo | 'todas'>('todas')
  const [availability, setAvailability] = useState<'todas' | 'disponible' | 'agotado'>('todas')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const [motorRange, setMotorRange] = useState<[number, number]>([0, 0])
  const [yearRange, setYearRange] = useState<[number, number]>([0, 0])
  const [isCatalogLoading, setIsCatalogLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Cuatrimoto | null>(null)
  const [purchaseProduct, setPurchaseProduct] = useState<Cuatrimoto | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/api/productos', { cache: 'no-store' })
        if (!response.ok) return
        const data = (await response.json()) as Cuatrimoto[]
        setProductos(data)
      } catch {
        setProductos([])
      } finally {
        setIsCatalogLoading(false)
      }
    }

    void fetchProductos()
  }, [])

  const filterRanges = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const prices = productos.map((p) => p.precio)
    const motors = productos.map((p) => Number(p.motor) || 0)

    if (!prices.length) {
      return {
        minPrice: 0,
        maxPrice: 1_000_000,
        minMotor: 0,
        maxMotor: 2000,
        minYear: currentYear - 9,
        maxYear: currentYear,
      }
    }

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minMotor: Math.min(...motors),
      maxMotor: Math.max(...motors),
      minYear: currentYear - 9,
      maxYear: currentYear,
    }
  }, [productos])

  useEffect(() => {
    if (!productos.length) return
    setPriceRange([filterRanges.minPrice, filterRanges.maxPrice])
    setMotorRange([filterRanges.minMotor, filterRanges.maxMotor])
    setYearRange([filterRanges.minYear, filterRanges.maxYear])
  }, [filterRanges, productos.length])

  useEffect(() => {
    if (isCatalogLoading) return
    setIsFiltering(true)
    const timer = setTimeout(() => setIsFiltering(false), 320)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategoria, availability, priceRange, motorRange, yearRange, isCatalogLoading])

  const filteredProducts = useMemo(() => {
    return productos.filter(producto => {
      const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.motor.includes(searchTerm) ||
        producto.año.includes(searchTerm)
      
      const matchesCategoria = selectedCategoria === 'todas' || producto.categoria === selectedCategoria
      const matchesAvailability =
        availability === 'todas' ||
        (availability === 'disponible' ? producto.disponible : !producto.disponible)
      const matchesPrice = producto.precio >= priceRange[0] && producto.precio <= priceRange[1]
      const motorValue = Number(producto.motor) || 0
      const matchesMotor = motorValue >= motorRange[0] && motorValue <= motorRange[1]
      const yearValue = Number(producto.año) || 0
      const matchesYear = yearValue >= yearRange[0] && yearValue <= yearRange[1]

      return matchesSearch && matchesCategoria && matchesAvailability && matchesPrice && matchesMotor && matchesYear
    })
  }, [searchTerm, selectedCategoria, availability, priceRange, motorRange, yearRange, productos])

  const catalogProducts = useMemo(() => {
    return filteredProducts.map((producto, index) => {
      const sameCategoryImages = productos
        .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
        .map((p) => p.imagen)
        .slice(0, 2)

      const premiumTag =
        !producto.disponible
          ? 'Última pieza'
          : index === 0
            ? 'Más vendida'
            : Number(producto.año) >= filterRanges.maxYear
              ? 'Nueva llegada'
              : 'Recomendada'

      return {
        ...producto,
        imagenes: [producto.imagen, ...sameCategoryImages],
        premiumTag,
      } as Cuatrimoto & { imagenes: string[]; premiumTag: string }
    })
  }, [filteredProducts, productos, filterRanges.maxYear])

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
    setAvailability('todas')
    setPriceRange([filterRanges.minPrice, filterRanges.maxPrice])
    setMotorRange([filterRanges.minMotor, filterRanges.maxMotor])
    setYearRange([filterRanges.minYear, filterRanges.maxYear])
  }

  const hasActiveFilters =
    !!searchTerm ||
    selectedCategoria !== 'todas' ||
    availability !== 'todas' ||
    priceRange[0] !== filterRanges.minPrice ||
    priceRange[1] !== filterRanges.maxPrice ||
    motorRange[0] !== filterRanges.minMotor ||
    motorRange[1] !== filterRanges.maxMotor ||
    yearRange[0] !== filterRanges.minYear ||
    yearRange[1] !== filterRanges.maxYear

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value)

  const isPriceCustom = priceRange[0] !== filterRanges.minPrice || priceRange[1] !== filterRanges.maxPrice
  const isMotorCustom = motorRange[0] !== filterRanges.minMotor || motorRange[1] !== filterRanges.maxMotor
  const isYearCustom = yearRange[0] !== filterRanges.minYear || yearRange[1] !== filterRanges.maxYear

  const FilterPanel = () => (
    <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-card/95 via-card/90 to-secondary/35 backdrop-blur-md soft-shadow p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5">
          <Funnel className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Panel de filtros Honda</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="rounded-full border border-border/70 hover:border-primary/50 hover:bg-primary/10"
        >
          <X className="w-4 h-4 mr-1.5" />
          Limpiar filtros
        </Button>
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Categorías
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant={selectedCategoria === 'todas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategoria('todas')}
            className="rounded-full px-4 min-w-[110px] transition-all duration-300 hover:-translate-y-0.5"
          >
            <SlidersHorizontal className="w-4 h-4 mr-1.5" />
            Todas ({categoryCounts.todas})
          </Button>
          {CATEGORIAS.map((cat) => {
            if ((categoryCounts[cat.value] ?? 0) === 0) return null
            const Icon = CATEGORIA_ICONS[cat.value]
            return (
              <Button
                key={cat.value}
                variant={selectedCategoria === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategoria(cat.value)}
                className="rounded-full px-4 min-w-[120px] transition-all duration-300 hover:-translate-y-0.5"
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {cat.label} ({categoryCounts[cat.value]})
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="rounded-xl border border-border/70 bg-background/45 p-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-medium text-card-foreground flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary" /> Precio</span>
            <span className="text-muted-foreground">{formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}</span>
          </div>
          <Slider
            min={filterRanges.minPrice}
            max={filterRanges.maxPrice}
            step={5000}
            value={priceRange}
            onValueChange={(value) => setPriceRange([value[0], value[1]])}
          />
        </div>

        <div className="rounded-xl border border-border/70 bg-background/45 p-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-medium text-card-foreground flex items-center gap-1.5"><Gauge className="w-4 h-4 text-primary" /> Cilindrada</span>
            <span className="text-muted-foreground">{motorRange[0]}cc - {motorRange[1]}cc</span>
          </div>
          <Slider
            min={filterRanges.minMotor}
            max={filterRanges.maxMotor}
            step={1}
            value={motorRange}
            onValueChange={(value) => setMotorRange([value[0], value[1]])}
          />
        </div>

        <div className="rounded-xl border border-border/70 bg-background/45 p-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-medium text-card-foreground flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Año</span>
            <span className="text-muted-foreground">{yearRange[0]} - {yearRange[1]}</span>
          </div>
          <Slider
            min={filterRanges.minYear}
            max={filterRanges.maxYear}
            step={1}
            value={yearRange}
            onValueChange={(value) => setYearRange([value[0], value[1]])}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { value: 'todas', label: 'Todas', icon: Filter },
          { value: 'disponible', label: 'Disponibles', icon: CircleCheck },
          { value: 'agotado', label: 'Agotadas', icon: CircleX },
        ].map((option) => (
          <Button
            key={option.value}
            variant={availability === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAvailability(option.value as 'todas' | 'disponible' | 'agotado')}
            className="rounded-full px-4 hover-scale"
          >
            <option.icon className="w-4 h-4 mr-1.5" />
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )

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

          {/* Search + Filters */}
          <div className="mb-8 space-y-5">
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/80" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, color, motor o año..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 rounded-full pl-12 pr-12 bg-card/80 border-border/70 focus-visible:ring-primary/40 focus-visible:border-primary/40 shadow-sm"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <Drawer open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DrawerTrigger asChild>
                  <Button size="icon" className="h-12 w-12 rounded-full shadow-md relative">
                    <Filter className="w-5 h-5" />
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-xs font-bold px-1">
                        {(selectedCategoria !== 'todas' ? 1 : 0) + (searchTerm ? 1 : 0) + (availability !== 'todas' ? 1 : 0) + (isPriceCustom ? 1 : 0) + (isMotorCustom ? 1 : 0) + (isYearCustom ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-background/98 border-border">
                  <DrawerHeader>
                    <DrawerTitle className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Filtros del catálogo
                    </DrawerTitle>
                    <DrawerDescription>
                      Ajusta los filtros para encontrar tu Honda ideal.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 pb-5 overflow-y-auto">
                    <FilterPanel />
                    <Button onClick={() => setIsFiltersOpen(false)} className="w-full mt-4 rounded-full">
                      Ver resultados
                    </Button>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap justify-center items-center gap-2.5 mt-4">
                {selectedCategoria !== 'todas' && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 bg-secondary/75 border border-border/70 flex items-center gap-1.5">
                    Categoría: {CATEGORIAS.find(c => c.value === selectedCategoria)?.label}
                    <button onClick={() => setSelectedCategoria('todas')}>
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 bg-secondary/75 border border-border/70 flex items-center gap-1.5">
                    Búsqueda: {searchTerm}
                    <button onClick={() => setSearchTerm('')}>
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </Badge>
                )}
                {availability !== 'todas' && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 bg-secondary/75 border border-border/70 flex items-center gap-1.5">
                    {availability === 'disponible' ? 'Solo disponibles' : 'Solo agotadas'}
                    <button onClick={() => setAvailability('todas')}>
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </Badge>
                )}
                {isPriceCustom && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 bg-secondary/75 border border-border/70 flex items-center gap-1.5">
                    Precio: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                    <button onClick={() => setPriceRange([filterRanges.minPrice, filterRanges.maxPrice])}>
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </Badge>
                )}
                {isMotorCustom && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 bg-secondary/75 border border-border/70 flex items-center gap-1.5">
                    Cilindrada: {motorRange[0]}cc - {motorRange[1]}cc
                    <button onClick={() => setMotorRange([filterRanges.minMotor, filterRanges.maxMotor])}>
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </Badge>
                )}
                {isYearCustom && (
                  <Badge variant="secondary" className="rounded-full px-3 py-1 bg-secondary/75 border border-border/70 flex items-center gap-1.5">
                    Año: {yearRange[0]} - {yearRange[1]}
                    <button onClick={() => setYearRange([filterRanges.minYear, filterRanges.maxYear])}>
                      <X className="w-3 h-3 ml-1" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-full border border-border/70 text-xs">
                  Limpiar todo
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Mostrando {catalogProducts.length} de {productos.length} vehículos Honda
          </p>

          {/* Products Grid */}
          {isCatalogLoading || isFiltering ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="p-0 overflow-hidden border-border/70 bg-card/70">
                  <Skeleton className="h-56 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : catalogProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {catalogProducts.map((producto) => (
                <ProductCard
                  key={producto.id}
                  cuatrimoto={producto}
                  onVerMas={handleVerMas}
                  onComprar={handleComprar}
                  featuredTag={producto.premiumTag}
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
