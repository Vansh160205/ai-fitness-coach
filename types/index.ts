export interface UserFormData {
  name: string
  age: string
  gender: string
  height: string
  weight: string
  fitnessGoal: string
  fitnessLevel: string
  workoutLocation: string
  dietaryPreference: string
  medicalHistory: string
  stressLevel: string
}

export interface Exercise {
  name: string
  sets: string
  reps: string
  rest?: string
}

export interface WorkoutDay {
  day: string
  exercises: Exercise[]
}

export interface DietMeal {
  meal: string
  items: string[]
  calories?: string
}

export interface FitnessPlan {
  userData: {
    name: string
    fitnessGoal: string
  }
  workoutPlan: WorkoutDay[]
  dietPlan: DietMeal[]
  tips: string[]
  motivation: string
}

export interface ImageItem {
  name: string
  type?: 'exercise' | 'food'
  sets?: string
  reps?: string
  rest?: string
}

export interface TTSRequest {
  text: string
  type: 'workout' | 'diet'
}

export interface ImageGenerationRequest {
  prompt: string
  type: 'exercise' | 'food'
}

export interface MotivationResponse {
  quote: string
}