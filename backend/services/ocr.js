import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractTextFromScreenshot(imageBuffer, mimeType = 'image/png') {
  const base64 = imageBuffer.toString('base64');
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64}` },
          },
          {
            type: 'text',
            text: 'Extract the exact text of the tweet or post from this screenshot. Return only the tweet text itself, no labels or explanation.',
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content.trim();
}
