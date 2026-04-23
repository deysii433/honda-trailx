import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { PremiumFeatured } from '@/components/premium-featured'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <PremiumFeatured />
      <Footer />
    </main>
  )
}
