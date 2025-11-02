import { NextRequest, NextResponse } from 'next/server'
import type { ImageGenerationRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { prompt, type }: ImageGenerationRequest = await request.json()

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Missing prompt or type' },
        { status: 400 }
      )
    }

    console.log('🖼️ Image Generation Request')
    console.log('Prompt:', prompt)
    console.log('Type:', type)

    // Create enhanced prompts for better AI image quality
    const enhancedPrompt =
      type === 'exercise'
        ? `professional fitness photography, athletic person performing ${prompt} exercise, correct form, modern gym environment, high quality, 4k resolution, dynamic pose, proper lighting`
        : `professional food photography, delicious ${prompt}, beautifully plated on elegant white plate, restaurant quality presentation, natural lighting, appetizing, high resolution, 4k, vibrant colors`

    console.log('Enhanced prompt:', enhancedPrompt)

    // Using Pollinations AI - 100% FREE, no API key needed
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      enhancedPrompt
    )}?width=1024&height=1024&nologo=true&enhance=true&model=flux`

    console.log('✅ Image URL generated successfully')
    console.log('URL:', imageUrl)

    return NextResponse.json({ 
      imageUrl,
      service: 'Pollinations AI (Flux)',
      success: true
    })

  } catch (error: any) {
    console.error('❌ Image generation error:', error.message)
    
    // Fallback to placeholder if something goes wrong
    const fallbackUrl = `https://via.placeholder.com/1024/${
      type === 'exercise' ? '6366f1' : '10b981'
    }/ffffff?text=${encodeURIComponent(prompt || 'Image')}`

    return NextResponse.json({ 
      imageUrl: fallbackUrl,
      service: 'Placeholder',
      error: error.message,
      success: false
    })
  }
}