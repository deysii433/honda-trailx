'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Cuatrimoto, CategoriaVehiculo, CATEGORIAS, FichaTecnica, TipoEntrega } from '@/lib/types'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { 
  AlertCircle,
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  Eye,
  Save,
  X,
  ImageIcon,
  Upload,
  Bike,
  Truck,
  CheckCircle2,
} from 'lucide-react'

const CATEGORIA_ICONS: Record<CategoriaVehiculo, React.ElementType> = {
  cuatrimoto: Bike,
  moto: Bike,
  pioneer: Truck,
}

type ApartadoRow = {
  id: string
  nombre_producto: string
  fecha: string
  monto_apartado: number
  estado_pedido: string
  tipo_compra: string
  metodo_pago: string | null
  metodo_contacto: string | null
  mensaje: string | null
  clientes?: { nombre: string; telefono: string } | null
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'lista' | 'agregar' | 'visitas' | 'solicitudes'>('lista')
  const [editingProduct, setEditingProduct] = useState<Cuatrimoto | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [customImages, setCustomImages] = useState<string[]>([])
  const [filterCategoria, setFilterCategoria] = useState<CategoriaVehiculo | 'todas'>('todas')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [productos, setProductos] = useState<Cuatrimoto[]>([])
  const [apartados, setApartados] = useState<ApartadoRow[]>([])
  const [listError, setListError] = useState('')
  const [formError, setFormError] = useState('')

  const fetchProductos = async () => {
    setListError('')
    try {
      const response = await fetch('/api/productos', { cache: 'no-store' })
      const raw = (await response.json().catch(() => ({}))) as { error?: string } | Cuatrimoto[]
      if (!response.ok) {
        setListError(typeof (raw as { error?: string }).error === 'string' ? (raw as { error: string }).error : 'No se pudieron cargar los productos')
        setProductos([])
        return
      }
      setProductos(Array.isArray(raw) ? raw : [])
    } catch {
      setListError('Error de red al cargar los productos')
      setProductos([])
    }
  }

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'cuatrimoto' as CategoriaVehiculo,
    precio: '',
    imagen: '/images/atv-1.jpg',
    imagenes: ['/images/atv-1.jpg'] as string[],
    color: '',
    traccion: '4x2',
    motor: '',
    año: new Date().getFullYear().toString(),
    combustible: 'Gasolina',
    descripcion: '',
    tipoEntrega: 'inmediata' as TipoEntrega,
    fichaTecnica: {
      suspension: '',
      transmision: '',
      velocidad: '',
      peso: '',
      tanque: '',
      arranque: '',
      enfriamiento: '',
    } as FichaTecnica,
    disponible: true,
  })

  useEffect(() => {
    void fetchProductos()
  }, [])

  const fetchApartados = async () => {
    try {
      const response = await fetch('/api/apartados', { cache: 'no-store' })
      const raw = (await response.json().catch(() => ([]))) as ApartadoRow[] | { error?: string }
      if (!response.ok) {
        setApartados([])
        return
      }
      setApartados(Array.isArray(raw) ? raw : [])
    } catch {
      setApartados([])
    }
  }

  useEffect(() => {
    if (activeTab !== 'solicitudes') return
    void fetchApartados()
  }, [activeTab])

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
    } catch {
      /* env faltante u otro error */
    }
    window.location.href = '/admin/login'
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: 'cuatrimoto',
      precio: '',
      imagen: '/images/atv-1.jpg',
      imagenes: ['/images/atv-1.jpg'],
      color: '',
      traccion: '4x2',
      motor: '',
      año: new Date().getFullYear().toString(),
      combustible: 'Gasolina',
      descripcion: '',
      tipoEntrega: 'inmediata',
      fichaTecnica: {
        suspension: '',
        transmision: '',
        velocidad: '',
        peso: '',
        tanque: '',
        arranque: '',
        enfriamiento: '',
      },
      disponible: true,
    })
  }

  const normalizeFichaTecnica = (ft: FichaTecnica) => {
    const trimmed = Object.fromEntries(
      Object.entries(ft).map(([k, v]) => [k, String(v ?? '').trim()])
    ) as FichaTecnica
    const hasAny = Object.values(trimmed).some((v) => v.length > 0)
    return hasAny ? trimmed : null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setCustomImages((prev) => [...prev, base64])
        setFormData((prev) => {
          const nextImages = prev.imagenes.includes(base64) ? prev.imagenes : [...prev.imagenes, base64]
          return { ...prev, imagenes: nextImages, imagen: nextImages[0] ?? base64 }
        })
      }
      reader.readAsDataURL(file)
    })

    // permite volver a seleccionar el mismo archivo
    e.target.value = ''
  }

  const toggleSelectedImage = (img: string) => {
    setFormData((prev) => {
      const exists = prev.imagenes.includes(img)
      const nextImages = exists ? prev.imagenes.filter((x) => x !== img) : [...prev.imagenes, img]
      const safeImages = nextImages.length > 0 ? nextImages : [prev.imagen]
      return { ...prev, imagenes: safeImages, imagen: safeImages[0] }
    })
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    const payload = {
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: parseInt(formData.precio),
      imagen: formData.imagen,
      imagenes: formData.imagenes,
      color: formData.color,
      traccion: formData.traccion,
      motor: formData.motor,
      año: formData.año,
      combustible: formData.combustible,
      descripcion: formData.descripcion,
      tipoEntrega: formData.tipoEntrega,
      fichaTecnica: normalizeFichaTecnica(formData.fichaTecnica) ?? undefined,
      disponible: formData.disponible,
    }

    const response = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const raw = (await response.json().catch(() => ({}))) as { error?: string }
    if (!response.ok) {
      setFormError(typeof raw.error === 'string' ? raw.error : 'No se pudo guardar el vehículo')
      return
    }

    await fetchProductos()
    resetForm()
    setActiveTab('lista')
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleEditProduct = (producto: Cuatrimoto) => {
    setFormError('')
    setEditingProduct(producto)
    setFormData({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      imagen: producto.imagen,
      imagenes: producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : [producto.imagen],
      color: producto.color,
      traccion: producto.traccion,
      motor: producto.motor,
      año: producto.año,
      combustible: producto.combustible,
      descripcion: producto.descripcion,
      tipoEntrega: producto.tipoEntrega ?? 'inmediata',
      fichaTecnica: producto.fichaTecnica ?? {
        suspension: '',
        transmision: '',
        velocidad: '',
        peso: '',
        tanque: '',
        arranque: '',
        enfriamiento: '',
      },
      disponible: producto.disponible,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    setFormError('')

    const payload = {
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: parseInt(formData.precio),
      imagen: formData.imagen,
      imagenes: formData.imagenes,
      color: formData.color,
      traccion: formData.traccion,
      motor: formData.motor,
      año: formData.año,
      combustible: formData.combustible,
      descripcion: formData.descripcion,
      tipoEntrega: formData.tipoEntrega,
      fichaTecnica: normalizeFichaTecnica(formData.fichaTecnica) ?? undefined,
      disponible: formData.disponible,
    }

    const response = await fetch(`/api/productos/${editingProduct.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const raw = (await response.json().catch(() => ({}))) as { error?: string }
    if (!response.ok) {
      setFormError(typeof raw.error === 'string' ? raw.error : 'No se pudo actualizar')
      return
    }

    await fetchProductos()

    setIsEditModalOpen(false)
    setEditingProduct(null)
    resetForm()
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleDeleteProduct = async (id: string) => {
    setFormError('')
    const response = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    const raw = (await response.json().catch(() => ({}))) as { error?: string }
    if (!response.ok) {
      setFormError(typeof raw.error === 'string' ? raw.error : 'No se pudo eliminar')
      return
    }
    await fetchProductos()
    setDeleteProductId(null)
  }

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const defaultImages = [
    '/images/atv-1.jpg',
    '/images/atv-2.jpg',
    '/images/atv-3.jpg',
    '/images/atv-4.jpg',
    '/images/atv-5.jpg',
    '/images/atv-6.jpg',
    '/images/pioneer-1.jpg',
    '/images/pioneer-2.jpg',
    '/images/pioneer-3.jpg',
    '/images/moto-1.jpg',
    '/images/moto-2.jpg',
  ]

  const allImages = [...defaultImages, ...customImages]
  const añoOpciones = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString())

  const filteredProductos = filterCategoria === 'todas' 
    ? productos 
    : productos.filter(p => p.categoria === filterCategoria)

  const getCategoriaLabel = (cat: CategoriaVehiculo) => {
    return CATEGORIAS.find(c => c.value === cat)?.label || cat
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Cambios guardados correctamente</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">H</span>
                </div>
              </Link>
              <span className="text-lg font-semibold text-card-foreground">
                Panel Honda
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/catalogo" target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver catálogo
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {listError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{listError}</AlertDescription>
          </Alert>
        )}
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-card-foreground">{productos.length}</p>
              </div>
            </div>
          </Card>
          {CATEGORIAS.map(cat => {
            const Icon = CATEGORIA_ICONS[cat.value]
            const count = productos.filter(p => p.categoria === cat.value).length
            return (
              <Card key={cat.value} className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{cat.label}s</p>
                    <p className="text-xl font-bold text-card-foreground">{count}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'lista' ? 'default' : 'outline'}
            onClick={() => {
              setFormError('')
              setActiveTab('lista')
            }}
          >
            <Package className="w-4 h-4 mr-2" />
            Productos
          </Button>
          <Button
            variant={activeTab === 'visitas' ? 'default' : 'outline'}
            onClick={() => {
              setFormError('')
              setActiveTab('visitas')
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Más visitadas
          </Button>
          <Button
            variant={activeTab === 'solicitudes' ? 'default' : 'outline'}
            onClick={() => {
              setFormError('')
              setActiveTab('solicitudes')
            }}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Solicitudes
          </Button>
          <Button
            variant={activeTab === 'agregar' ? 'default' : 'outline'}
            onClick={() => {
              resetForm()
              setFormError('')
              setActiveTab('agregar')
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar nuevo
          </Button>
        </div>

        {/* Product List */}
        {activeTab === 'lista' && (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={filterCategoria === 'todas' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilterCategoria('todas')}
              >
                Todas
              </Button>
              {CATEGORIAS.map(cat => (
                <Button
                  key={cat.value}
                  variant={filterCategoria === cat.value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterCategoria(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProductos.map((producto) => (
                <Card key={producto.id} className="bg-card border-border overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <Badge 
                        className={producto.disponible ? 'bg-green-600' : 'bg-destructive'}
                      >
                        {producto.disponible ? 'Disponible' : 'Agotado'}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">
                        {getCategoriaLabel(producto.categoria)}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-card-foreground">{producto.nombre}</h3>
                    <p className="text-sm text-muted-foreground">
                      Honda | {producto.motor}cc | {producto.año} | {producto.combustible}
                    </p>
                    <p className="text-lg font-bold text-primary mt-2">
                      {formatPrice(producto.precio)}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditProduct(producto)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => setDeleteProductId(producto.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProductos.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No hay productos en esta categoría</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('agregar')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar producto
                </Button>
              </div>
            )}
          </>
        )}

        {activeTab === 'visitas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-card-foreground">Productos más visitados</h2>
              <Button variant="outline" size="sm" onClick={fetchProductos}>
                Actualizar
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...productos]
                .sort((a, b) => (b.visitas ?? 0) - (a.visitas ?? 0))
                .map((producto) => (
                  <Card key={`visitas-${producto.id}`} className="bg-card border-border overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      <Image src={producto.imagen} alt={producto.nombre} fill className="object-cover" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          {(producto.visitas ?? 0).toLocaleString('es-MX')} visitas
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {getCategoriaLabel(producto.categoria)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-card-foreground">{producto.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        Honda | {producto.motor}cc | {producto.año}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">{formatPrice(producto.precio)}</p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'solicitudes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-card-foreground">Solicitudes / Mensajes</h2>
              <Button variant="outline" size="sm" onClick={fetchApartados}>
                Actualizar
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {apartados.map((row) => (
                <Card key={row.id} className="bg-card border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-card-foreground">{row.nombre_producto}</p>
                      <p className="text-sm text-muted-foreground">
                        {row.clientes?.nombre ?? 'Cliente'} · {row.clientes?.telefono ?? 'Sin teléfono'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {row.tipo_compra}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg border border-border/70 bg-secondary/30 p-2">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Estado</p>
                      <p className="font-semibold text-card-foreground capitalize">{row.estado_pedido}</p>
                    </div>
                    <div className="rounded-lg border border-border/70 bg-secondary/30 p-2">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Monto</p>
                      <p className="font-semibold text-card-foreground">
                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(row.monto_apartado ?? 0))}
                      </p>
                    </div>
                  </div>
                  {row.mensaje && (
                    <div className="mt-3 rounded-lg border border-border/70 bg-secondary/30 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Mensaje</p>
                      <p className="text-sm text-card-foreground mt-1 whitespace-pre-wrap">{row.mensaje}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            {apartados.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No hay solicitudes todavía.
              </div>
            )}
          </div>
        )}

        {/* Add Product Form */}
        {activeTab === 'agregar' && (
          <Card className="max-w-2xl p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-card-foreground mb-6">Agregar nuevo vehículo Honda</h2>
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleAddProduct} className="space-y-6">
              {/* Categoría */}
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIAS.map(cat => {
                    const Icon = CATEGORIA_ICONS[cat.value]
                    return (
                      <Button
                        key={cat.value}
                        type="button"
                        variant={formData.categoria === cat.value ? 'default' : 'outline'}
                        onClick={() => setFormData({ ...formData, categoria: cat.value })}
                        className="flex-1"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {cat.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del modelo *</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Honda TRX450R"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio (MXN) *</Label>
                  <Input
                    id="precio"
                    type="number"
                    placeholder="Ej: 185000"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                    className="bg-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motor">Motor (cc) *</Label>
                  <Input
                    id="motor"
                    type="number"
                    placeholder="Ej: 420, 520, 700"
                    value={formData.motor}
                    onChange={(e) => setFormData({ ...formData, motor: e.target.value })}
                    required
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="año">Año *</Label>
                  <select
                    id="año"
                    value={formData.año}
                    onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                  >
                    {añoOpciones.map((año) => (
                      <option key={año} value={año}>{año}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="combustible">Combustible *</Label>
                  <select
                    id="combustible"
                    value={formData.combustible}
                    onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="Gasolina">Gasolina</option>
                    <option value="Sin plomo">Sin plomo</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    placeholder="Ej: Rojo"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    required
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="traccion">Tracción *</Label>
                  <select
                    id="traccion"
                    value={formData.traccion}
                    onChange={(e) => setFormData({ ...formData, traccion: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="4x2">4x2</option>
                    <option value="4x4">4x4</option>
                    <option value="Trasera">Trasera</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagen del producto *</Label>
                
                {/* Upload button */}
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Subir imagen de galería
                  </Button>
                </div>

                {/* Image selection grid */}
                <p className="text-sm text-muted-foreground mb-2">O selecciona una existente:</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {allImages.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => toggleSelectedImage(img)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        formData.imagenes.includes(img)
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Image src={img} alt="Opción" fill className="object-cover" />
                      {formData.imagenes.includes(img) && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción del producto..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  rows={4}
                  className="bg-input resize-none"
                />
              </div>

              <div className="space-y-3 rounded-lg border border-border/70 bg-secondary/30 p-4">
                <div>
                  <Label className="font-medium">Ficha técnica (opcional)</Label>
                  <p className="text-sm text-muted-foreground">Esto se mostrará en el modal de “Ver más”.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      ['suspension', 'Suspensión'],
                      ['transmision', 'Transmisión'],
                      ['velocidad', 'Velocidad'],
                      ['peso', 'Peso'],
                      ['tanque', 'Tanque'],
                      ['arranque', 'Arranque'],
                      ['enfriamiento', 'Enfriamiento'],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`ft-${key}`}>{label}</Label>
                      <Input
                        id={`ft-${key}`}
                        value={formData.fichaTecnica[key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fichaTecnica: { ...formData.fichaTecnica, [key]: e.target.value },
                          })
                        }
                        className="bg-input"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-border/70 bg-secondary/30 p-4">
                <Label className="font-medium">Tipo de entrega</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={formData.tipoEntrega === 'inmediata' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, tipoEntrega: 'inmediata' })}
                  >
                    Entrega inmediata
                  </Button>
                  <Button
                    type="button"
                    variant={formData.tipoEntrega === 'pedido' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, tipoEntrega: 'pedido' })}
                  >
                    Por pedido
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.tipoEntrega === 'inmediata'
                    ? 'Se muestra como entrega inmediata en el catálogo.'
                    : 'Se muestra como por pedido (tiempo a confirmar).'}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <Label htmlFor="disponible" className="font-medium">Disponibilidad</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.disponible ? 'Disponible para apartado' : 'Agotado'}
                  </p>
                </div>
                <Switch
                  id="disponible"
                  checked={formData.disponible}
                  onCheckedChange={(checked) => setFormData({ ...formData, disponible: checked })}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setActiveTab('lista')
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>

      {/* Edit Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setFormError('')
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Editar vehículo</DialogTitle>
            <DialogDescription>
              Modifica los datos del vehículo Honda
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleUpdateProduct} className="space-y-6">
            {/* Categoría */}
            <div className="space-y-2">
              <Label>Categoría</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map(cat => {
                  const Icon = CATEGORIA_ICONS[cat.value]
                  return (
                    <Button
                      key={cat.value}
                      type="button"
                      variant={formData.categoria === cat.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormData({ ...formData, categoria: cat.value })}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {cat.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-precio">Precio (MXN) *</Label>
                <Input
                  id="edit-precio"
                  type="number"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  required
                  className="bg-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-motor">Motor (cc) *</Label>
                <Input
                  id="edit-motor"
                  type="number"
                  value={formData.motor}
                  onChange={(e) => setFormData({ ...formData, motor: e.target.value })}
                  required
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-año">Año *</Label>
                <select
                  id="edit-año"
                  value={formData.año}
                  onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                >
                  {añoOpciones.map((año) => (
                    <option key={año} value={año}>{año}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-combustible">Combustible</Label>
                <select
                  id="edit-combustible"
                  value={formData.combustible}
                  onChange={(e) => setFormData({ ...formData, combustible: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Sin plomo">Sin plomo</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color *</Label>
                <Input
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  required
                  className="bg-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-traccion">Tracción *</Label>
                <select
                  id="edit-traccion"
                  value={formData.traccion}
                  onChange={(e) => setFormData({ ...formData, traccion: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                >
                  <option value="4x2">4x2</option>
                  <option value="4x4">4x4</option>
                  <option value="Trasera">Trasera</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {allImages.map((img, index) => (
                  <button
                    key={`edit-${img}-${index}`}
                    type="button"
                    onClick={() => toggleSelectedImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      formData.imagenes.includes(img)
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <Image src={img} alt="Opción" fill className="object-cover" />
                    {formData.imagenes.includes(img) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-descripcion">Descripción *</Label>
              <Textarea
                id="edit-descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                rows={3}
                className="bg-input resize-none"
              />
            </div>

            <div className="space-y-3 rounded-lg border border-border/70 bg-secondary/30 p-4">
              <div>
                <Label className="font-medium">Ficha técnica (opcional)</Label>
                <p className="text-sm text-muted-foreground">Se verá en el modal de “Ver más”.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  [
                    ['suspension', 'Suspensión'],
                    ['transmision', 'Transmisión'],
                    ['velocidad', 'Velocidad'],
                    ['peso', 'Peso'],
                    ['tanque', 'Tanque'],
                    ['arranque', 'Arranque'],
                    ['enfriamiento', 'Enfriamiento'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`edit-ft-${key}`}>{label}</Label>
                    <Input
                      id={`edit-ft-${key}`}
                      value={formData.fichaTecnica[key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fichaTecnica: { ...formData.fichaTecnica, [key]: e.target.value },
                        })
                      }
                      className="bg-input"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-border/70 bg-secondary/30 p-4">
              <Label className="font-medium">Tipo de entrega</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={formData.tipoEntrega === 'inmediata' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, tipoEntrega: 'inmediata' })}
                >
                  Entrega inmediata
                </Button>
                <Button
                  type="button"
                  variant={formData.tipoEntrega === 'pedido' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData({ ...formData, tipoEntrega: 'pedido' })}
                >
                  Por pedido
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.tipoEntrega === 'inmediata'
                  ? 'Se muestra como entrega inmediata en el catálogo.'
                  : 'Se muestra como por pedido (tiempo a confirmar).'}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <Label htmlFor="edit-disponible" className="font-medium">Disponibilidad</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.disponible ? 'Disponible' : 'Agotado'}
                </p>
              </div>
              <Switch
                id="edit-disponible"
                checked={formData.disponible}
                onCheckedChange={(checked) => setFormData({ ...formData, disponible: checked })}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  resetForm()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El vehículo será eliminado permanentemente del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductId && handleDeleteProduct(deleteProductId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
