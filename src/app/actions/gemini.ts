// File: app/actions/gemini.ts
'use server';

// Define your Gemini API key as an environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function generateRecommendations(prompt: string) {
  try {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
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
        cache: 'no-store'
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API error:', errorData);
      throw new Error('Failed to get response from Gemini API');
    }

    const data = await geminiResponse.json();
    
    // Extract the response text from Gemini API
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         'Sorry, no suggestions could be generated at this time.';

    return { response: responseText };
  } catch (error) {
    console.error('Error in Gemini server action:', error);
    throw error;
  }
}