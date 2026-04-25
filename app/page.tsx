import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { HomeGallery } from '@/components/home-gallery'
import { PremiumFeatured } from '@/components/premium-featured'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HomeGallery />
      <PremiumFeatured />
      <Footer />
    </main>
  )
}
