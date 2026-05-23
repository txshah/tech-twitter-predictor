import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseReport(markdownContent, tweetText) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 2048,
    messages: [
      {
        role: 'system',
        content:
          'You are a data extraction assistant. Extract structured metrics from AI simulation reports. Return valid JSON only — no markdown fences, no explanation.',
      },
      {
        role: 'user',
        content: `Original tweet: "${tweetText}"

Simulation report:
${markdownContent}

Extract the following metrics as a JSON object. Infer scores from the report tone and content if not stated explicitly.

{
  "stockBuyIntent": <0-100 integer, how much the agents wanted to buy related stock>,
  "memePotential": <0-100 integer, how meme-worthy/viral the content is>,
  "cloutGain": <0-100 integer, estimated social clout gain for the poster>,
  "fudFactor": <0-100 integer, how much doubt/dunking/FUD the tweet will receive>,
  "twitterSentiment": <0-100 integer, overall Twitter agent sentiment>,
  "redditSentiment": <0-100 integer, overall Reddit agent sentiment>,
  "subreddits": [
    { "name": "r/...", "score": <0-100>, "sentiment": "bullish"|"bearish"|"neutral"|"meme" }
  ],
  "topMemes": ["<meme format string>", "<meme format string>", "<meme format string>"],
  "verdict": "<one punchy sentence predicting what actually happens>"
}`,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  const metrics = JSON.parse(raw);
  metrics.tweetText = tweetText;
  return metrics;
}
