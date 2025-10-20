'use client'

import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          className:
            'rounded-2xl border border-white/20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-xl text-zinc-900 dark:text-zinc-100 p-0 overflow-hidden',
          style: { padding: 0, background: 'transparent' },
        }}
        containerStyle={{
          top: 20,
        }}
      />
      {children}
    </>
  )
}