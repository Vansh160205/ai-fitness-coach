import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body first
    const rawBody = await request.text()
    console.log('==========================================')
    console.log('🎙️ TTS API - Server Side')
    console.log('==========================================')
    console.log('1. Raw body:', rawBody.substring(0, 500))
    
    // Parse it
    const body = JSON.parse(rawBody)
    console.log('2. Parsed body keys:', Object.keys(body))
    console.log('3. Type:', body.type)
    console.log('4. Data exists:', !!body.data)
    console.log('5. Data is array:', Array.isArray(body.data))
    console.log('6. Data length:', body.data?.length)
    
    if (body.data && body.data.length > 0) {
      console.log('7. First data item:', JSON.stringify(body.data[0]).substring(0, 200))
    }
    console.log('==========================================')

    const { type, data } = body

    let textToSpeak = ''

    // Build speech from data
    if (type === 'workout' && data && Array.isArray(data) && data.length > 0) {
      console.log('✅ Building workout speech from data...')
      textToSpeak = 'Here is your personalized workout plan. '
      
      // Process first 3 days
      for (let i = 0; i < Math.min(3, data.length); i++) {
        const day = data[i]
        if (day && day.day) {
          textToSpeak += `${day.day}. `
          
          // Process first 3 exercises
          if (day.exercises && Array.isArray(day.exercises)) {
            for (let j = 0; j < Math.min(3, day.exercises.length); j++) {
              const ex = day.exercises[j]
              if (ex && ex.name) {
                textToSpeak += `${ex.name}, ${ex.sets || '3'} sets of ${ex.reps || '10'} reps. `
              }
            }
          }
        }
      }
      
      textToSpeak += 'Keep pushing towards your goals!'
    } 
    else if (type === 'diet' && data && Array.isArray(data) && data.length > 0) {
      console.log('✅ Building diet speech from data...')
      textToSpeak = 'Here is your personalized nutrition plan. '
      
      // Process all meals
      for (let i = 0; i < data.length; i++) {
        const meal = data[i]
        if (meal && meal.meal) {
          textToSpeak += `For ${meal.meal}, have `
          
          if (meal.items && Array.isArray(meal.items) && meal.items.length > 0) {
            const items = meal.items.slice(0, 3)
            textToSpeak += items.join(', ')
            if (meal.items.length > 3) {
              textToSpeak += `, and ${meal.items.length - 3} more items`
            }
          }
          
          if (meal.calories) {
            textToSpeak += `, approximately ${meal.calories} calories`
          }
          
          textToSpeak += '. '
        }
      }
      
      textToSpeak += 'Eat healthy and stay hydrated!'
    } 
    else {
      console.log('⚠️ Using fallback text - no data provided')
      textToSpeak = type === 'workout'
        ? 'Here is your personalized workout plan for the week. Follow each exercise with proper form and recommended rest periods.'
        : 'Here is your personalized nutrition plan. Make sure to eat balanced meals throughout the day.'
    }

    console.log('Final speech text:', textToSpeak.substring(0, 200) + '...')
    console.log('==========================================')

    // Call ElevenLabs
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text: textToSpeak,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs error:', errorText)
      throw new Error('Failed to generate speech')
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('❌ TTS API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech.' },
      { status: 500 }
    )
  }
}