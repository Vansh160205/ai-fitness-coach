import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { UserFormData, FitnessPlan } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const userData: UserFormData = await request.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are an expert fitness coach and nutritionist. Create a highly personalized and detailed fitness plan based on the following user data:

Name: ${userData.name}
Age: ${userData.age}
Gender: ${userData.gender}
Height: ${userData.height}cm
Weight: ${userData.weight}kg
Fitness Goal: ${userData.fitnessGoal}
Fitness Level: ${userData.fitnessLevel}
Workout Location: ${userData.workoutLocation}
Dietary Preference: ${userData.dietaryPreference}
Medical History: ${userData.medicalHistory || 'None'}
Stress Level: ${userData.stressLevel || 'Moderate'}

Create a comprehensive plan with:
1. A 7-day workout plan with specific exercises, sets, reps, and rest periods
2. A detailed daily diet plan with breakfast, lunch, dinner, and snacks (with approximate calories)
3. 5 personalized tips for success
4. A motivational quote

IMPORTANT: Respond ONLY with valid JSON in this EXACT format (no markdown, no code blocks, just pure JSON):
{
  "userData": {
    "name": "${userData.name}",
    "fitnessGoal": "${userData.fitnessGoal}"
  },
  "workoutPlan": [
    {
      "day": "Monday",
      "exercises": [
        {"name": "Exercise name", "sets": "3", "reps": "10-12", "rest": "60 seconds"}
      ]
    }
  ],
  "dietPlan": [
    {
      "meal": "Breakfast",
      "items": ["Item 1", "Item 2"],
      "calories": "400"
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "motivation": "Your motivational quote here"
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const plan: FitnessPlan = JSON.parse(text)

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error generating plan:', error)
    
    // Fallback plan in case of error
    const fallbackPlan: FitnessPlan = {
      userData: {
        name: "User",
        fitnessGoal: "General Fitness"
      },
      workoutPlan: [
        {
          day: "Monday - Upper Body",
          exercises: [
            { name: "Push-ups", sets: "3", reps: "10-15", rest: "60 seconds" },
            { name: "Dumbbell Rows", sets: "3", reps: "12", rest: "60 seconds" },
            { name: "Shoulder Press", sets: "3", reps: "10", rest: "60 seconds" }
          ]
        },
        {
          day: "Tuesday - Lower Body",
          exercises: [
            { name: "Squats", sets: "4", reps: "12", rest: "90 seconds" },
            { name: "Lunges", sets: "3", reps: "10 each leg", rest: "60 seconds" },
            { name: "Calf Raises", sets: "3", reps: "15", rest: "45 seconds" }
          ]
        },
        {
          day: "Wednesday - Cardio & Core",
          exercises: [
            { name: "Running", sets: "1", reps: "20 minutes", rest: "N/A" },
            { name: "Plank", sets: "3", reps: "45 seconds", rest: "30 seconds" },
            { name: "Bicycle Crunches", sets: "3", reps: "20", rest: "30 seconds" }
          ]
        },
        {
          day: "Thursday - Rest or Active Recovery",
          exercises: [
            { name: "Walking", sets: "1", reps: "30 minutes", rest: "N/A" },
            { name: "Stretching", sets: "1", reps: "15 minutes", rest: "N/A" }
          ]
        },
        {
          day: "Friday - Full Body",
          exercises: [
            { name: "Burpees", sets: "3", reps: "10", rest: "60 seconds" },
            { name: "Deadlifts", sets: "3", reps: "10", rest: "90 seconds" },
            { name: "Pull-ups", sets: "3", reps: "8", rest: "60 seconds" }
          ]
        },
        {
          day: "Saturday - HIIT",
          exercises: [
            { name: "Jump Squats", sets: "4", reps: "15", rest: "30 seconds" },
            { name: "Mountain Climbers", sets: "4", reps: "20", rest: "30 seconds" },
            { name: "High Knees", sets: "4", reps: "30 seconds", rest: "30 seconds" }
          ]
        },
        {
          day: "Sunday - Rest",
          exercises: [
            { name: "Light Yoga", sets: "1", reps: "20 minutes", rest: "N/A" },
            { name: "Meditation", sets: "1", reps: "10 minutes", rest: "N/A" }
          ]
        }
      ],
      dietPlan: [
        {
          meal: "Breakfast",
          items: ["Oatmeal with berries", "2 eggs", "Green tea"],
          calories: "450"
        },
        {
          meal: "Mid-Morning Snack",
          items: ["Greek yogurt", "Handful of almonds"],
          calories: "200"
        },
        {
          meal: "Lunch",
          items: ["Grilled chicken breast", "Brown rice", "Mixed vegetables", "Salad"],
          calories: "550"
        },
        {
          meal: "Afternoon Snack",
          items: ["Apple with peanut butter", "Protein shake"],
          calories: "250"
        },
        {
          meal: "Dinner",
          items: ["Baked salmon", "Quinoa", "Steamed broccoli", "Sweet potato"],
          calories: "600"
        },
        {
          meal: "Evening Snack (Optional)",
          items: ["Cottage cheese", "Cucumber slices"],
          calories: "150"
        }
      ],
      tips: [
        "Stay hydrated - drink at least 8 glasses of water daily",
        "Get 7-8 hours of quality sleep every night",
        "Track your progress with photos and measurements",
        "Focus on form over weight to prevent injuries",
        "Be consistent - results take time and dedication"
      ],
      motivation: "The only bad workout is the one that didn't happen. Keep pushing! 💪"
    }

    return NextResponse.json(fallbackPlan)
  }
}