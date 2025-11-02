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

    const enhancedPrompt =
      type === 'exercise'
        ? `professional fitness photography, person performing ${prompt}, proper form, modern gym environment, athletic, high quality, realistic lighting`
        : `professional food photography, ${prompt}, beautifully plated, appetizing, restaurant quality, natural lighting, high resolution`

    // Try Replicate first if API token exists
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        const Replicate = require('replicate')
        const replicate = new Replicate({
          auth: process.env.REPLICATE_API_TOKEN,
        })

        const output = (await replicate.run(
          'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
          {
            input: {
              prompt: enhancedPrompt,
              negative_prompt: 'ugly, blurry, low quality, distorted, deformed',
              num_outputs: 1,
              width: 1024,
              height: 1024,
            },
          }
        )) as string[]

        const imageUrl = output[0]
        return NextResponse.json({ imageUrl })
      } catch (replicateError) {
        console.error('Replicate failed, falling back to Pollinations AI:', replicateError)
      }
    }

    // Fallback to FREE Pollinations AI (no API key needed!)
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      enhancedPrompt
    )}?width=1024&height=1024&nologo=true&enhance=true`

    return NextResponse.json({ imageUrl: pollinationsUrl })

  } catch (error) {
    console.error('Error generating image:', error)

    // Final fallback - placeholder
    const { prompt, type } = await request.json()
    const placeholderUrl = `https://via.placeholder.com/1024/${
      type === 'exercise' ? '6366f1' : '10b981'
    }/ffffff?text=${encodeURIComponent(prompt || 'Image')}`

    return NextResponse.json({ imageUrl: placeholderUrl })
  }
}