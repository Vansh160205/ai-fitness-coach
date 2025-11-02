import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeToggle from '../components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Fitness Coach - Personalized Workout & Diet Plans',
  description: 'Get AI-powered personalized fitness and nutrition plans tailored to your goals',
  keywords: ['fitness', 'AI', 'workout', 'diet', 'health', 'nutrition'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          <ThemeToggle />
          {children}
        </div>
      </body>
    </html>
  )
}