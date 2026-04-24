'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Cuatrimoto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { X, Phone, MessageCircle, CheckCircle2, CreditCard, Wallet } from 'lucide-react'
import { informacionNegocio } from '@/lib/data'

interface PurchaseModalProps {
  cuatrimoto: Cuatrimoto | null
  isOpen: boolean
  onClose: () => void
}

export function PurchaseModal({ cuatrimoto, isOpen, onClose }: PurchaseModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    tipoCompra: 'comprar',
    metodoPago: '',
    nombre: '',
    telefono: '',
    metodoContacto: 'whatsapp',
    enganche: '',
    mensaje: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!cuatrimoto) return null

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const engancheOpciones = [
    { value: '10', label: '10%', monto: cuatrimoto.precio * 0.10 },
    { value: '20', label: '20%', monto: cuatrimoto.precio * 0.20 },
    { value: '30', label: '30%', monto: cuatrimoto.precio * 0.30 },
    { value: '50', label: '50%', monto: cuatrimoto.precio * 0.50 },
  ]
  const metodosPago = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'deposito', label: 'Deposito bancario' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const engancheInfo = engancheOpciones.find(e => e.value === formData.enganche)
    const montoEnganche = engancheInfo ? formatPrice(engancheInfo.monto) : 'Por definir'
    const restante = engancheInfo ? formatPrice(cuatrimoto.precio - engancheInfo.monto) : formatPrice(cuatrimoto.precio)
    const metodoPagoSeleccionado = metodosPago.find((m) => m.value === formData.metodoPago)?.label || 'Por definir'
    const esApartado = formData.tipoCompra === 'apartar'

    const mensaje = `¡Hola! Quiero ${esApartado ? 'APARTAR' : 'COMPRAR AL MOMENTO'} este vehiculo Honda:

*${cuatrimoto.nombre}*
Precio total: ${formatPrice(cuatrimoto.precio)}
Motor: ${cuatrimoto.motor}cc | Año: ${cuatrimoto.año}

${esApartado ? `*Sistema de Apartado:*
Enganche: ${formData.enganche}% (${montoEnganche})
Restante a liquidar: ${restante}` : `*Compra al momento:*
Metodo de pago elegido: ${metodoPagoSeleccionado}`}

*Mis datos:*
Nombre: ${formData.nombre}
Teléfono: ${formData.telefono}
Contacto preferido: ${formData.metodoContacto === 'whatsapp' ? 'WhatsApp' : 'Llamada'}

${formData.mensaje ? `Comentarios: ${formData.mensaje}` : ''}

¿Me pueden ayudar a finalizar el proceso?`

    const montoApartado = esApartado
      ? engancheInfo?.monto ?? 0
      : cuatrimoto.precio

    await fetch('/api/apartados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteId: null,
        productoId: cuatrimoto.id,
        nombreProducto: cuatrimoto.nombre,
        nombreCliente: formData.nombre,
        telefono: formData.telefono,
        fecha: new Date().toISOString(),
        montoApartado,
        estadoPedido: 'pendiente',
        tipoCompra: formData.tipoCompra,
        metodoPago: formData.metodoPago || null,
        metodoContacto: formData.metodoContacto,
        mensaje: formData.mensaje || null,
      }),
    })

    const whatsappUrl = `https://wa.me/52${informacionNegocio.whatsapp}?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappUrl, '_blank')

    setIsSubmitted(true)
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      tipoCompra: 'comprar',
      metodoPago: '',
      nombre: '',
      telefono: '',
      metodoContacto: 'whatsapp',
      enganche: '',
      mensaje: '',
    })
    setIsSubmitted(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 bg-card border-border overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3">
              {formData.tipoCompra === 'apartar' ? '¡Solicitud de apartado enviada!' : '¡Solicitud de compra enviada!'}
            </h3>
            <p className="text-muted-foreground mb-6">
              Hemos recibido tu solicitud para {formData.tipoCompra === 'apartar' ? 'apartar' : 'comprar'} la {cuatrimoto.nombre}.
              Uno de nuestros asesores se pondrá en contacto contigo para finalizar el proceso por WhatsApp.
            </p>
            <Button onClick={handleClose} className="w-full">
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            {/* Product Summary */}
            <div className="flex items-center gap-4 p-6 bg-secondary/50 border-b border-border">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={cuatrimoto.imagen}
                  alt={cuatrimoto.nombre}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-card-foreground">{cuatrimoto.nombre}</h3>
                <p className="text-sm text-muted-foreground">Honda | {cuatrimoto.motor}cc | {cuatrimoto.año}</p>
                <p className="text-lg font-bold text-primary">{formatPrice(cuatrimoto.precio)}</p>
              </div>
            </div>

            <div className="p-6">
              <DialogHeader className="text-left mb-6">
                <DialogTitle className="text-xl font-bold">
                  Compra Honda
                </DialogTitle>
                <DialogDescription>
                  Compra al momento o aparta con enganche. Finaliza por WhatsApp con un asesor.
                </DialogDescription>
              </DialogHeader>

              {/* Info de facilidades */}
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-card-foreground text-sm">Facilidades de pago</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Da un enganche y liquida el resto en pagos. La cuatrimoto se entrega una vez liquidado el total.
                      Aceptamos todas las tarjetas de crédito y débito.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <>
                    {/* Formas de pago primero */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Formas de pago disponibles</Label>
                      <RadioGroup
                        value={formData.metodoPago}
                        onValueChange={(value) =>
                          setFormData({ ...formData, metodoPago: value, tipoCompra: 'comprar', enganche: '' })
                        }
                        className={`grid grid-cols-1 gap-3 ${formData.tipoCompra === 'apartar' ? 'opacity-60 pointer-events-none' : ''}`}
                      >
                        {metodosPago.map((metodo) => (
                          <Label
                            key={metodo.value}
                            htmlFor={`pago-${metodo.value}`}
                            className={`flex items-center justify-between gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.metodoPago === metodo.value && formData.tipoCompra === 'comprar'
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-muted-foreground'
                            }`}
                          >
                            <RadioGroupItem value={metodo.value} id={`pago-${metodo.value}`} className="sr-only" />
                            <span className="font-medium">{metodo.label}</span>
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                          </Label>
                        ))}
                      </RadioGroup>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tipoCompra: 'apartar', metodoPago: '' })}
                        className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-card-foreground">¿Prefieres Apartar?</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Reserva con enganche y liquida después. (También es parte del proceso de compra)
                            </p>
                          </div>
                          <Wallet className="w-5 h-5 text-primary" />
                        </div>
                      </button>
                    </div>

                    {/* Selección de enganche */}
                    <div className={`space-y-3 ${formData.tipoCompra !== 'apartar' ? 'opacity-60 pointer-events-none' : ''}`}>
                      <Label className="text-base font-semibold">
                        ¿Cuánto deseas dar de enganche?
                      </Label>
                      <RadioGroup
                        value={formData.enganche}
                        onValueChange={(value) => setFormData({ ...formData, enganche: value })}
                        className="grid grid-cols-2 gap-3"
                      >
                        {engancheOpciones.map((opcion) => (
                          <Label
                            key={opcion.value}
                            htmlFor={`enganche-${opcion.value}`}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.enganche === opcion.value
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-muted-foreground'
                            }`}
                          >
                            <RadioGroupItem value={opcion.value} id={`enganche-${opcion.value}`} className="sr-only" />
                            <Wallet className={`w-6 h-6 mb-2 ${formData.enganche === opcion.value ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-bold text-lg">{opcion.label}</span>
                            <span className="text-xs text-muted-foreground">{formatPrice(opcion.monto)}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Método de contacto */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        ¿Cómo deseas que te contactemos?
                      </Label>
                      <RadioGroup
                        value={formData.metodoContacto}
                        onValueChange={(value) => setFormData({ ...formData, metodoContacto: value })}
                        className="grid grid-cols-2 gap-3"
                      >
                        <Label
                          htmlFor="whatsapp"
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.metodoContacto === 'whatsapp'
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <RadioGroupItem value="whatsapp" id="whatsapp" className="sr-only" />
                          <MessageCircle className={`w-6 h-6 ${formData.metodoContacto === 'whatsapp' ? 'text-green-500' : 'text-muted-foreground'}`} />
                          <span className="font-medium">WhatsApp</span>
                        </Label>
                        <Label
                          htmlFor="llamada"
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.metodoContacto === 'llamada'
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <RadioGroupItem value="llamada" id="llamada" className="sr-only" />
                          <Phone className={`w-6 h-6 ${formData.metodoContacto === 'llamada' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-medium">Llamada</span>
                        </Label>
                      </RadioGroup>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full"
                      disabled={formData.tipoCompra === 'apartar' ? !formData.enganche : !formData.metodoPago}
                    >
                      Continuar
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    {/* Resumen */}
                    {formData.tipoCompra === 'apartar' && formData.enganche && (
                      <div className="p-4 bg-secondary rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Enganche ({formData.enganche}%):</span>
                          <span className="font-semibold text-card-foreground">
                            {formatPrice(engancheOpciones.find(e => e.value === formData.enganche)?.monto || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Restante a liquidar:</span>
                          <span className="font-semibold text-card-foreground">
                            {formatPrice(cuatrimoto.precio - (engancheOpciones.find(e => e.value === formData.enganche)?.monto || 0))}
                          </span>
                        </div>
                      </div>
                    )}

                    {formData.tipoCompra === 'comprar' && (
                      <div className="p-4 bg-secondary rounded-lg space-y-1">
                        <p className="text-sm text-muted-foreground">Método de pago elegido</p>
                        <p className="font-semibold text-card-foreground">
                          {metodosPago.find((m) => m.value === formData.metodoPago)?.label || 'Por definir'}
                        </p>
                      </div>
                    )}

                    {/* Datos de contacto */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input
                          id="nombre"
                          placeholder="Tu nombre completo"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          required
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Número de teléfono *</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="Ej: 55 1234 5678"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          required
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mensaje">Comentarios adicionales (opcional)</Label>
                        <Textarea
                          id="mensaje"
                          placeholder="¿Tienes alguna pregunta sobre la compra o el apartado?"
                          value={formData.mensaje}
                          onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                          rows={3}
                          className="bg-input resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={!formData.nombre || !formData.telefono || (formData.tipoCompra === 'comprar' && !formData.metodoPago) || (formData.tipoCompra === 'apartar' && !formData.enganche)}
                      >
                        Enviar a WhatsApp
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
