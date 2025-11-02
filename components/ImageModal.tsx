'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import type { ImageItem } from '@/types'

interface ImageModalProps {
  item: ImageItem
  onClose: () => void
}

export default function ImageModal({ item, onClose }: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    generateImage()
  }, [item])

  const generateImage = async () => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: item.name,
          type: item.type || 'exercise',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setImageUrl(data.imageUrl)
    } catch (error) {
      console.error('Error generating image:', error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {item.name}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Failed to generate image. Please check your API key.
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}