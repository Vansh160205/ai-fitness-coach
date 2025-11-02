'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { User, Target, Dumbbell, Apple, Heart, Loader2 } from 'lucide-react'
import type { UserFormData } from '@/types'

interface FitnessFormProps {
  onSubmit: (data: UserFormData) => void
  loading: boolean
}

export default function FitnessForm({ onSubmit, loading }: FitnessFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    fitnessLevel: '',
    workoutLocation: '',
    dietaryPreference: '',
    medicalHistory: '',
    stressLevel: '',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
  const labelClass =
    'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Personal Info
            </h3>
          </div>

          <div>
            <label className={labelClass}>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="10"
                max="100"
                className={inputClass}
                placeholder="25"
              />
            </div>
            <div>
              <label className={labelClass}>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Height (cm) *</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                min="100"
                max="250"
                className={inputClass}
                placeholder="170"
              />
            </div>
            <div>
              <label className={labelClass}>Weight (kg) *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                min="30"
                max="300"
                className={inputClass}
                placeholder="70"
              />
            </div>
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Fitness Goals
            </h3>
          </div>

          <div>
            <label className={labelClass}>Fitness Goal *</label>
            <select
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select Goal</option>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="endurance">Build Endurance</option>
              <option value="flexibility">Improve Flexibility</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Fitness Level *</label>
            <select
              name="fitnessLevel"
              value={formData.fitnessLevel}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Workout Location *</label>
            <select
              name="workoutLocation"
              value={formData.workoutLocation}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select Location</option>
              <option value="home">Home</option>
              <option value="gym">Gym</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
        </div>

        {/* Diet & Health */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Apple className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Diet Preferences
            </h3>
          </div>

          <div>
            <label className={labelClass}>Dietary Preference *</label>
            <select
              name="dietaryPreference"
              value={formData.dietaryPreference}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Stress Level</label>
            <select
              name="stressLevel"
              value={formData.stressLevel}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Level</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Medical History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Health Info
            </h3>
          </div>

          <div>
            <label className={labelClass}>Medical History (Optional)</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className={inputClass}
              rows={4}
              placeholder="Any injuries, conditions, or medications..."
            />
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Your Personalized Plan...
          </>
        ) : (
          <>
            <Dumbbell className="w-5 h-5" />
            Generate My Fitness Plan
          </>
        )}
      </motion.button>
    </motion.form>
  )
}