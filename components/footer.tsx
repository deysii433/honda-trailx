'use client'

import Link from 'next/link'
import { Facebook, Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react'
import { informacionNegocio } from '@/lib/data'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">H</span>
              </div>
              <div>
                <span className="text-xl font-bold text-card-foreground">
                  Honda <span className="text-primary">Motors</span>
                </span>
                <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">DISTRIBUIDOR AUTORIZADO</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tu distribuidor autorizado Honda en México. 
              Cuatrimotos, motos y Pioneer con garantía y servicio técnico especializado.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-card-foreground font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-card-foreground font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${informacionNegocio.telefono}`} className="hover:text-primary transition-colors">
                  {informacionNegocio.telefono}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${informacionNegocio.email}`} className="hover:text-primary transition-colors">
                  {informacionNegocio.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>{informacionNegocio.direccion}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>{informacionNegocio.horario}</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-card-foreground font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-3">
              <a
                href={informacionNegocio.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/52${informacionNegocio.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Honda Motors México. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
