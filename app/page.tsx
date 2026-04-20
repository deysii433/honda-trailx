import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Footer />
    </main>
  )
}
