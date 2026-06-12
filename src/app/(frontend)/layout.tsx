import React from 'react'
import { Raleway, Outfit } from 'next/font/google'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
  icons: {
    icon: '/icons/isotipo.svg',
  },
}

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-outfit',
  display: 'swap',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es" className={`scroll-smooth ${raleway.variable} ${outfit.variable}`}>
      <body className="font-outfit antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}
