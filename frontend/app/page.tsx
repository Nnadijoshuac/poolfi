'use client'

import { useState } from 'react'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Contribution from '@/components/landing/Contribution'
import WhyPoolFi from '@/components/landing/WhyPoolFi'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import WaitlistModal from '@/components/modals/WaitlistModal'

export default function Home() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)

  const handleGetStarted = () => {
    setShowWaitlistModal(true)
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f7f9fc' }}>
      <Navbar onGetStarted={handleGetStarted} />
      <Hero onGetStarted={handleGetStarted} />
      <Contribution />
      <WhyPoolFi onGetStarted={handleGetStarted} />
      <CTA onGetStarted={handleGetStarted} />
      <Footer />
      
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </main>
  )
}