'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { informacionNegocio } from '@/lib/data'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  MessageCircle,
  Send,
  CheckCircle2
} from 'lucide-react'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const mensaje = `¡Hola! Mi nombre es ${formData.nombre}.

${formData.mensaje}

Datos de contacto:
- Email: ${formData.email}
- Teléfono: ${formData.telefono}

Por favor, contáctenme a la brevedad.`

    const whatsappUrl = `https://wa.me/52${informacionNegocio.whatsapp}?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappUrl, '_blank')
    
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
    setIsSubmitted(false)
  }

  const contactInfo = [
    {
      icon: Phone,
      label: 'Teléfono',
      value: informacionNegocio.telefono,
      href: `tel:${informacionNegocio.telefono}`,
    },
    {
      icon: Mail,
      label: 'Correo electrónico',
      value: informacionNegocio.email,
      href: `mailto:${informacionNegocio.email}`,
    },
    {
      icon: MapPin,
      label: 'Dirección',
      value: informacionNegocio.direccion,
      href: `https://maps.google.com/?q=${encodeURIComponent(informacionNegocio.direccion)}`,
    },
    {
      icon: Clock,
      label: 'Horario',
      value: informacionNegocio.horario,
      href: null,
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold rounded-full bg-primary/20 text-primary border border-primary/30">
              Atención Personalizada
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              <span className="gradient-text">Contáctanos</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes alguna pregunta o estás interesado en alguno de nuestros vehículos? 
              ¡Estamos aquí para ayudarte!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-6 sm:p-8 bg-card border-border">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Gracias por contactarnos. Uno de nuestros asesores se pondrá en contacto contigo muy pronto.
                  </p>
                  <Button onClick={handleReset}>
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-card-foreground mb-6">
                    Envíanos un mensaje
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input
                          id="nombre"
                          placeholder="Tu nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          required
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="Tu teléfono"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          required
                          className="bg-input"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje *</Label>
                      <Textarea
                        id="mensaje"
                        placeholder="¿En qué podemos ayudarte?"
                        value={formData.mensaje}
                        onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                        required
                        rows={5}
                        className="bg-input resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={!formData.nombre || !formData.email || !formData.telefono || !formData.mensaje}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Enviar mensaje
                    </Button>
                  </form>
                </>
              )}
            </Card>

            {/* Contact Info & Map */}
            <div className="space-y-8">
              {/* Contact Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => (
                  <Card key={info.label} className="p-5 bg-card border-border hover:border-primary/50 transition-colors card-hover">
                    {info.href ? (
                      <a href={info.href} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full bg-primary/20">
                            <info.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{info.label}</p>
                            <p className="font-medium text-card-foreground hover:text-primary transition-colors">
                              {info.value}
                            </p>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/20">
                          <info.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{info.label}</p>
                          <p className="font-medium text-card-foreground">{info.value}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Social & Quick Contact */}
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Contáctanos directamente
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/52${informacionNegocio.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <a
                    href={informacionNegocio.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <Facebook className="w-5 h-5 mr-2" />
                      Facebook
                    </Button>
                  </a>
                  <a href={`tel:${informacionNegocio.telefono}`}>
                    <Button variant="outline">
                      <Phone className="w-5 h-5 mr-2" />
                      Llamar
                    </Button>
                  </a>
                </div>
              </Card>

              {/* Map */}
              <Card className="overflow-hidden bg-card border-border">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Nuestra ubicación
                  </h3>
                </div>
                <div className="aspect-video relative">
                  <iframe
  src="https://www.google.com/maps/embed?pb=!4v1776641366114!6m8!1m7!1s6DHhlc3yTlumXBEG3xJoRQ!2m2!1d18.89880811275452!2d-100.1395204891441!3f272.2351784340845!4f-2.7082482674113777!5f0.7820865974627469"
  className="absolute inset-0 w-full h-full"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Ubicación exacta"
/>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
