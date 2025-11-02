import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MotivationResponse } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = 'Generate a short, powerful, motivational fitness quote (maximum 15 words). Just the quote text, nothing else.'

    const result = await model.generateContent(prompt)
    const response = await result.response
    let quote = response.text().trim()

    // Remove quotes if present
    quote = quote.replace(/^["']|["']$/g, '')

    const motivationResponse: MotivationResponse = { quote }

    return NextResponse.json(motivationResponse)
  } catch (error) {
    console.error('Error generating quote:', error)
    
    // Fallback quotes
    const fallbackQuotes = [
      'Your only limit is you. Push harder today! 💪',
      'Transform your body, transform your life!',
      'Every workout counts. Make it happen!',
      'Believe in yourself and crush your goals!',
      'Strong body, strong mind, unstoppable spirit!',
      'Progress, not perfection. Keep moving forward!',
      'You are stronger than you think!',
    ]
    
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    
    const response: MotivationResponse = { quote: randomQuote }
    return NextResponse.json(response)
  }
}