'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Volume2,
  RefreshCw,
  Dumbbell,
  Apple,
  Lightbulb,
  Image as ImageIcon,
} from 'lucide-react'
import jsPDF from 'jspdf'
import ImageModal from './ImageModal'
import type { FitnessPlan, ImageItem } from '@/types'

interface PlanDisplayProps {
  plan: FitnessPlan
  onRegenerate: () => void
}

export default function PlanDisplay({ plan, onRegenerate }: PlanDisplayProps) {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false)
  const [speaking, setSpeaking] = useState<boolean>(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.src = ''
      }
    }
  }, [currentAudio])

  const handleSpeak = async (type: 'workout' | 'diet') => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
    }

    setSpeaking(true)

    try {
      // ✅ CORRECT: Send data, not text
      const dataToSend = type === 'workout' ? plan.workoutPlan : plan.dietPlan

      console.log('🎤 Frontend sending:', { type, dataLength: dataToSend.length })

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type,
          data: dataToSend  // ✅ Sending 'data' not 'text'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate speech')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      setCurrentAudio(audio)
      audio.play()

      audio.onended = () => {
        setSpeaking(false)
        setCurrentAudio(null)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setSpeaking(false)
        setCurrentAudio(null)
        URL.revokeObjectURL(audioUrl)
        alert('Error playing audio')
      }
    } catch (error) {
      console.error('Error with TTS:', error)
      alert('Text-to-speech failed.')
      setSpeaking(false)
    }
  }

  const handleImageClick = (item: ImageItem, type: 'exercise' | 'food') => {
    setSelectedItem({ ...item, type })
    setImageModalOpen(true)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    const maxWidth = pageWidth - margin * 2
    let yPos = margin

    const addWrappedText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number = 7
    ): number => {
      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line: string) => {
        if (y > pageHeight - margin - 15) {
          doc.addPage()
          y = margin
        }
        doc.text(line, x, y)
        y += lineHeight
      })
      return y
    }

    const checkNewPage = (spaceNeeded: number = 25): number => {
      if (yPos > pageHeight - spaceNeeded - 15) {
        doc.addPage()
        return margin
      }
      return yPos
    }

    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    yPos = addWrappedText('AI Fitness Coach', margin, yPos, maxWidth)
    
    doc.setFontSize(16)
    yPos = addWrappedText('Your Personalized Fitness Plan', margin, yPos + 5, maxWidth)
    yPos += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    yPos = addWrappedText(`Name: ${plan.userData.name}`, margin, yPos, maxWidth)
    yPos = addWrappedText(`Goal: ${plan.userData.fitnessGoal}`, margin, yPos, maxWidth)
    yPos = addWrappedText(`Date: ${new Date().toLocaleDateString()}`, margin, yPos, maxWidth)
    yPos += 10

    yPos = checkNewPage(30)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    yPos = addWrappedText('💪 Workout Plan', margin, yPos, maxWidth)
    yPos += 5

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    plan.workoutPlan.forEach((day) => {
      yPos = checkNewPage(40)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      yPos = addWrappedText(day.day, margin, yPos, maxWidth)
      yPos += 2

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)

      day.exercises.forEach((exercise, exIndex) => {
        yPos = checkNewPage(20)

        const exerciseText = `${exIndex + 1}. ${exercise.name}`
        yPos = addWrappedText(exerciseText, margin + 5, yPos, maxWidth - 5)

        const detailsText = `   ${exercise.sets} sets × ${exercise.reps} reps${
          exercise.rest ? ` | Rest: ${exercise.rest}` : ''
        }`
        yPos = addWrappedText(detailsText, margin + 5, yPos, maxWidth - 5)
        yPos += 2
      })

      yPos += 5
    })

    yPos = checkNewPage(30)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    yPos = addWrappedText('🥗 Diet Plan', margin, yPos, maxWidth)
    yPos += 5

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    plan.dietPlan.forEach((meal) => {
      yPos = checkNewPage(30)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      yPos = addWrappedText(meal.meal, margin, yPos, maxWidth)
      
      if (meal.calories) {
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        yPos = addWrappedText(`(~${meal.calories} calories)`, margin, yPos, maxWidth)
      }
      yPos += 2

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)

      meal.items.forEach((item) => {
        yPos = checkNewPage(15)
        const itemText = `  • ${item}`
        yPos = addWrappedText(itemText, margin + 5, yPos, maxWidth - 5, 6)
      })

      yPos += 5
    })

    yPos = checkNewPage(30)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    yPos = addWrappedText('💡 Tips for Success', margin, yPos, maxWidth)
    yPos += 5

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    plan.tips.forEach((tip, index) => {
      yPos = checkNewPage(20)
      const tipText = `${index + 1}. ${tip}`
      yPos = addWrappedText(tipText, margin, yPos, maxWidth - 10, 6)
      yPos += 3
    })

    if (plan.motivation) {
      yPos = checkNewPage(25)
      yPos += 5
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bolditalic')
      yPos = addWrappedText(`"${plan.motivation}"`, margin, yPos, maxWidth, 8)
    }

    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
      doc.text(
        'Generated by AI Fitness Coach',
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      )
    }

    const fileName = `${plan.userData.name.replace(/\s+/g, '_')}_Fitness_Plan.pdf`
    doc.save(fileName)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => handleSpeak('workout')}
          disabled={speaking}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 className="w-5 h-5" />
          {speaking ? 'Speaking...' : 'Read Workout Plan'}
        </button>
        <button
          onClick={() => handleSpeak('diet')}
          disabled={speaking}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 className="w-5 h-5" />
          {speaking ? 'Speaking...' : 'Read Diet Plan'}
        </button>
        <button
          onClick={exportToPDF}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all"
        >
          <Download className="w-5 h-5" />
          Export PDF
        </button>
        <button
          onClick={onRegenerate}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Regenerate Plan
        </button>
      </div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Dumbbell className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Workout Plan
          </h2>
        </div>
        <div className="space-y-6">
          {plan.workoutPlan.map((day, index) => (
            <div key={index} className="border-l-4 border-primary pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {day.day}
              </h3>
              <div className="grid gap-3">
                {day.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleImageClick(exercise, 'exercise')}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {exercise.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.rest && ` • Rest: ${exercise.rest}`}
                        </p>
                      </div>
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Apple className="w-8 h-8 text-green-500" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Diet Plan
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {plan.dietPlan.map((meal, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {meal.meal}
              </h3>
              <ul className="space-y-2">
                {meal.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 dark:text-gray-200 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleImageClick({ name: item }, 'food')}
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {item}
                    <ImageIcon className="w-4 h-4 ml-auto text-gray-400" />
                  </li>
                ))}
              </ul>
              {meal.calories && (
                <p className="mt-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  ~{meal.calories} calories
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-8 h-8" />
          <h2 className="text-3xl font-bold">AI Tips & Motivation</h2>
        </div>
        <div className="space-y-3">
          {plan.tips.map((tip, index) => (
            <p key={index} className="text-lg">
              💡 {tip}
            </p>
          ))}
        </div>
        {plan.motivation && (
          <p className="mt-6 text-2xl font-bold italic border-t-2 border-white/30 pt-4">
            "{plan.motivation}"
          </p>
        )}
      </motion.div>

      {imageModalOpen && selectedItem && (
        <ImageModal item={selectedItem} onClose={() => setImageModalOpen(false)} />
      )}
    </motion.div>
  )
}