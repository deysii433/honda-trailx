'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Facebook, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { informacionNegocio } from '@/lib/data'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const enlaces = [
    { href: '/', label: 'Inicio' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-primary">
              <span className="text-primary-foreground font-bold text-xl">H</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-foreground">
                Honda <span className="text-primary">Motors</span>
              </span>
              <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">DISTRIBUIDOR AUTORIZADO</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {enlace.label}
              </Link>
            ))}
          </div>

          {/* Social & Contact */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={informacionNegocio.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-secondary-foreground" />
            </a>
            <a
              href={`https://wa.me/52${informacionNegocio.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
            <a
              href={`tel:${informacionNegocio.telefono}`}
              className="p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors"
              aria-label="Llamar"
            >
              <Phone className="w-5 h-5 text-primary-foreground" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Menú"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-3">
            {enlaces.map((enlace) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {enlace.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <a
                href={informacionNegocio.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-secondary-foreground" />
              </a>
              <a
                href={`https://wa.me/52${informacionNegocio.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a
                href={`tel:${informacionNegocio.telefono}`}
                className="p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                aria-label="Llamar"
              >
                <Phone className="w-5 h-5 text-primary-foreground" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
