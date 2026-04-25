'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Award, Banknote, CreditCard, Headset, ShieldCheck, Sparkles, Star, Truck, Wallet } from 'lucide-react'

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ventajas */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <Badge className="bg-primary/20 text-primary border border-primary/30">Ventajas de compra</Badge>
            <h3 className="mt-4 text-3xl font-bold text-foreground">Compra con respaldo total</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: ShieldCheck, title: 'Garantia Honda', text: 'Todos nuestros modelos son originales y cuentan con respaldo oficial.' },
              { icon: Truck, title: 'Entrega segura', text: 'Coordinamos envios y entrega en punto acordado con seguimiento.' },
              { icon: Headset, title: 'Asesoria experta', text: 'Te ayudamos a elegir el modelo ideal segun tu tipo de uso.' },
              { icon: Award, title: 'Financiamiento flexible', text: 'Opciones de apartado y facilidades de pago a tu medida.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border/70 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 soft-shadow">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Metodos de Pago */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <Badge className="bg-primary/20 text-primary border border-primary/30">Metodos de pago</Badge>
            <h3 className="mt-4 text-3xl font-bold text-foreground">Compra inmediata o apartado</h3>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Elige la forma de compra que mejor se adapte a ti: puedes apartar tu unidad o comprarla al momento.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/70 bg-card/80 p-6 soft-shadow">
              <h4 className="text-lg font-semibold text-foreground">Formas de compra</h4>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
                  <p className="font-medium text-foreground">Apartado</p>
                  <p className="text-sm text-muted-foreground">Reserva tu vehiculo y completa el proceso por WhatsApp con asesoria personalizada.</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-secondary/40 px-4 py-3">
                  <p className="font-medium text-foreground">Compra al momento</p>
                  <p className="text-sm text-muted-foreground">Liquida el total de tu unidad y agenda entrega de inmediato.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-gradient-to-b from-card to-card/70 p-6 soft-shadow">
              <h4 className="text-lg font-semibold text-foreground">Medios aceptados</h4>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-border/70 bg-secondary/40 px-4 py-4 text-center">
                  <Wallet className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Efectivo</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-secondary/40 px-4 py-4 text-center">
                  <CreditCard className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Transferencia</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-secondary/40 px-4 py-4 text-center">
                  <Banknote className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Deposito bancario</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonios */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <Badge className="bg-primary/20 text-primary border border-primary/30">Testimonios</Badge>
            <h3 className="mt-4 text-3xl font-bold text-foreground">Lo que dicen nuestros clientes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Carlos M.', model: 'Honda TRX450R', quote: 'Excelente atencion y entrega puntual. La cuatrimoto llego impecable y lista para ruta.' },
              { name: 'Andrea P.', model: 'Honda Pioneer 700', quote: 'Me explicaron todo el proceso de compra y me apoyaron con un plan de pago muy claro.' },
              { name: 'Luis R.', model: 'Honda CRF450R', quote: 'Servicio premium de principio a fin. Sin duda, la mejor opcion para comprar Honda en Mexico.' },
            ].map((testimonial) => (
              <div key={testimonial.name} className="rounded-xl border border-border/70 bg-gradient-to-b from-card to-card/70 p-6 soft-shadow transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-1 text-primary mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-muted-foreground">"{testimonial.quote}"</p>
                <div className="mt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-primary">{testimonial.model}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <div className="text-center mb-10">
            <Badge className="bg-primary/20 text-primary border border-primary/30">FAQ</Badge>
            <h3 className="mt-4 text-3xl font-bold text-foreground">Preguntas frecuentes</h3>
          </div>
          <div className="max-w-3xl mx-auto rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm px-6 sm:px-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base">Que incluye el proceso de apartado?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Incluye cotizacion, confirmacion de disponibilidad y bloqueo de unidad con anticipo para asegurar tu modelo.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base">Realizan entregas fuera de Tejupilco?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Si. Coordinamos entrega en varios puntos del Estado de Mexico y zonas cercanas con logistica segura.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base">Los modelos cuentan con garantia?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Todos los vehiculos comercializados son Honda originales y aplican a garantia conforme a politicas vigentes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Sobre Nosotros */}
        <div className="mt-24 rounded-2xl border border-border/70 bg-gradient-to-r from-card via-card/90 to-secondary/50 p-8 sm:p-10 soft-shadow">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/30">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Sobre nosotros</span>
            </div>
            <h3 className="mt-4 text-3xl font-bold text-foreground">ATV Mexico: pasion por el rendimiento Honda</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Somos especialistas en cuatrimotos, Pioneer y motos Honda. Nuestro enfoque combina asesoria personalizada,
              inventario seleccionado y una experiencia premium para que elijas con confianza.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Trabajamos para construir relaciones de largo plazo con cada cliente, ofreciendo transparencia, respaldo y
              acompanamiento antes y despues de la compra.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
