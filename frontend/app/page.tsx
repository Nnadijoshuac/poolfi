'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Contribution from '@/components/landing/Contribution'
import WhyPoolFi from '@/components/landing/WhyPoolFi'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import ConnectWalletModal from '@/components/modals/ConnectWalletModal'
import Dashboard from '@/components/Dashboard'
import EnvDebug from '@/components/EnvDebug'

export default function Home() {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showApp, setShowApp] = useState(false)
  const { isConnected } = useAccount()

  // Check if wallet is connected on component mount
  useEffect(() => {
    if (isConnected) {
      setIsWalletConnected(true)
      setShowApp(true)
    }
  }, [isConnected])

  const handleGetStarted = () => {
    if (isWalletConnected) {
      setShowApp(true)
    } else {
      setShowWalletModal(true)
    }
  }

  const handleWalletConnected = () => {
    setIsWalletConnected(true)
    setShowApp(true)
  }

  // Show the main app if wallet is connected and user has proceeded
  if (showApp && isWalletConnected) {
    return <Dashboard />
  }

  // Show landing page
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f7f9fc' }}>
      <Navbar onGetStarted={handleGetStarted} />
      <Hero onGetStarted={handleGetStarted} />
      <Contribution />
      <WhyPoolFi onGetStarted={handleGetStarted} />
      <CTA onGetStarted={handleGetStarted} />
      <Footer />
      
      <ConnectWalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onWalletConnected={handleWalletConnected}
      />
      
      <EnvDebug />
    </main>
  )
}