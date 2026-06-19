import './globals.css'
import Providers from './Providers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'PrepTrack',
  description: 'PrepTrack application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}