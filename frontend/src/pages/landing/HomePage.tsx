import { AboutSection } from '@/components/landing/AboutSection'
import { ContactSection } from '@/components/landing/ContactSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { FeaturedProducts } from '@/components/landing/FeaturedProducts'
import { Footer } from '@/components/landing/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { Navbar } from '@/components/landing/Navbar'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { StatisticsSection } from '@/components/landing/StatisticsSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { TrackingCTA } from '@/components/landing/TrackingCTA'
import { WhyChooseUs } from '@/components/landing/WhyChooseUs'
import { usePageTitle } from '@/hooks/usePageTitle'

function HomePage() {
  usePageTitle('Beranda')

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_24%),linear-gradient(180deg,_#ffffff_0%,_#f9fafb_56%,_#f3f4f6_100%)] text-slate-900">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WhyChooseUs />
      <FeaturedProducts />
      <ProcessSection />
      <TrackingCTA />
      <StatisticsSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default HomePage
