'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { MotivationResponse } from '@/types'

export default function MotivationQuote() {
  const [quote, setQuote] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchQuote()
  }, [])

  const fetchQuote = async () => {
    try {
      const response = await fetch('/api/motivation')
      const data: MotivationResponse = await response.json()
      setQuote(data.quote)
    } catch (error) {
      console.error('Error fetching quote:', error)
      setQuote('Transform your body, transform your life! 💪')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8 p-6 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg"
    >
      <div className="flex items-center gap-3 text-white">
        <Sparkles className="w-6 h-6 flex-shrink-0" />
        <p className="text-lg font-medium italic">{quote}</p>
      </div>
    </motion.div>
  )
}