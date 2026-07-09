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
import { useEffect } from 'react'

function HomePage() {
  usePageTitle('Beranda')

  useEffect(() => {
    document.documentElement.classList.add('landing-scrollbar')
    document.body.classList.add('landing-scrollbar')

    return () => {
      document.documentElement.classList.remove('landing-scrollbar')
      document.body.classList.remove('landing-scrollbar')
    }
  }, [])

  return (
    <div className="landing-page min-h-screen bg-white text-slate-900">
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
