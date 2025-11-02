'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FitnessForm from '@/components/FitnessForm'
import PlanDisplay from '@/components/PlanDisplay'
import MotivationQuote from '@/components/MotivationQuote'
import { Dumbbell } from 'lucide-react'
import type { UserFormData, FitnessPlan } from '@/types'

export default function Home() {
  const [plan, setPlan] = useState<FitnessPlan | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    // Load saved plan from localStorage
    const savedPlan = localStorage.getItem('fitnessPlan')
    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan))
      } catch (error) {
        console.error('Error parsing saved plan:', error)
        localStorage.removeItem('fitnessPlan')
      }
    }
  }, [])

  const handleGeneratePlan = async (formData: UserFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate plan')
      }

      const data: FitnessPlan = await response.json()
      setPlan(data)
      localStorage.setItem('fitnessPlan', JSON.stringify(data))
    } catch (error) {
      console.error('Error generating plan:', error)
      alert('Failed to generate plan. Please check your API keys and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    setPlan(null)
    localStorage.removeItem('fitnessPlan')
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Dumbbell className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Fitness Coach
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Your personalized AI-powered fitness and nutrition assistant
        </p>
      </motion.div>

      <MotivationQuote />

      {!plan ? (
        <FitnessForm onSubmit={handleGeneratePlan} loading={loading} />
      ) : (
        <PlanDisplay plan={plan} onRegenerate={handleRegenerate} />
      )}
    </main>
  )
}