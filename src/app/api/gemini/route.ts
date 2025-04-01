// File: app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define your Gemini API key as an environment variable
// Add to your .env.local file: GEMINI_API_KEY=your_api_key_here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function POST(request: NextRequest) {
  try {
    // Get the prompt from the request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Prepare the request to Gemini API
    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Call the Gemini API
    const geminiResponse = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequest),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from Gemini API' },
        { status: geminiResponse.status }
      );
    }

    const data = await geminiResponse.json();
    
    // Extract the response text from Gemini API
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         'Sorry, no suggestions could be generated at this time.';

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}