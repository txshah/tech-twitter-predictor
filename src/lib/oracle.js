import { SUBREDDIT_POOL, MEME_TAG_POOL, ROAST_QUOTE_TEMPLATES, VERDICT_LEVELS } from './constants.js';

function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededInt(seed, min, max) {
  const x = Math.sin(seed + 1) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function getReaction(vibe, cringe, controversy) {
  const map = {
    pedantic: [
      'This is technically incorrect on multiple levels.',
      'Did you even read the documentation?',
      'The post assumes things that are provably false.',
    ],
    anxious: [
      'Am I behind? Should I quit? What does this mean for my career?',
      'Posted at 2am. Regret imminent.',
      "I'm updating my resume right now.",
    ],
    condescending: [
      'So to explain this to a five-year-old...',
      'The OP clearly has never heard of first principles.',
      "Let me break down why this is wrong, simply.",
    ],
    contrarian: [
      'Actually the opposite is true and people are too scared to say it.',
      'Hot take: this whole thread is cope.',
      'Change my mind: this is the most overrated take of 2024.',
    ],
    horrified: [
      '"Thrilled to announce" energy. I\'m out.',
      'Someone approved this post to go live.',
      'The audacity. THE AUDACITY.',
    ],
    suspicious: [
      'This reads like an ad. Is this an ad?',
      "I've never seen corporate speak this concentrated.",
      'Who paid for this? Name them.',
    ],
    dismissive: [
      'Skipped. Not reading that.',
      'Nobody asked.',
      "Cool. Didn't read.",
    ],
    confused: [
      "I don't understand what I'm looking at.",
      'Why is this a thing?',
      'What context am I missing here?',
    ],
    hype: [
      "This is the next big thing. Calling it now.",
      'Pre-seed round when?',
      'Disrupting the space. Love to see it.',
    ],
    furious: [
      'This is why we need unions.',
      'Delete your account.',
      'The absolute state of tech culture.',
    ],
  };

  const pool = map[vibe] || map.dismissive;
  const idx = Math.floor((cringe + controversy) / 2 / 100 * pool.length) % pool.length;
  return pool[idx];
}

const SYSTEM_PROMPT = `You are CTTO — Crash The Tech Out. A ruthless AI oracle that simulates how the internet reacts to tech CEO posts. You have the cultural fluency of extremely online Twitter, the financial paranoia of WSB, and the comedic timing of a 2AM shitpost. Be specific to the actual post content. Never be generic.`;

const VERDICTS = ['MEGA VIRAL', 'WILL CLAP', 'MID', 'GETTING RATIO\'D', 'CRINGE VOID'];

function buildUserPrompt(postText, platform, isImage) {
  const mediaNote = isImage
    ? `This is an IMAGE post on ${platform}. Treat the provided text as an image caption or OCR transcript.`
    : `This is a TEXT post on ${platform}.`;

  return `${mediaNote}

POST CONTENT:
"""
${postText}
"""

Respond with ONLY a single JSON object — no markdown fences, no commentary, nothing else. The object must have exactly these fields:

{
  "verdict": one of ${JSON.stringify(VERDICTS)},
  "virality_score": integer 0-100,
  "clout_gain": integer -50 to 100,
  "stock_intent_score": integer 0-100,
  "meme_potential": integer 0-100,
  "ratio_risk": integer 0-100,
  "tldr": "one brutal sentence, max 12 words",
  "analysis": "2-3 sentences, savage and specific to this exact post",
  "predicted_first_reply": "written as a real tweet with @handles and attitude",
  "quote_tweet_killer": "the one quote tweet that ends their week",
  "meme_formats": ["format1", "format2", "format3", "format4"],
  "subreddits": [
    { "name": "r/tech", "intensity": 0-100, "reason": "max 5 words" },
    { "name": "r/wallstreetbets", "intensity": 0-100, "reason": "max 5 words" },
    { "name": "r/LinkedInLunatics", "intensity": 0-100, "reason": "max 5 words" },
    { "name": "r/Buttcoin", "intensity": 0-100, "reason": "max 5 words" },
    { "name": "r/antiwork", "intensity": 0-100, "reason": "max 5 words" }
  ],
  "audience_split": {
    "true_believers": 0-100,
    "haters": 0-100,
    "confused_boomers": 0-100,
    "journalists": 0-100,
    "meme_lords": 0-100
  },
  "timeline_hours": [
    { "hour": "0h",  "engagement": 0-100 },
    { "hour": "2h",  "engagement": 0-100 },
    { "hour": "6h",  "engagement": 0-100 },
    { "hour": "12h", "engagement": 0-100 },
    { "hour": "24h", "engagement": 0-100 },
    { "hour": "48h", "engagement": 0-100 },
    { "hour": "72h", "engagement": 0-100 }
  ],
  "should_they_post": true or false,
  "post_advice": "one sentence of savage but useful advice to the CEO"
}`;
}

export async function analyzePost(postText, platform, isImage) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY is not set in your .env file');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 1500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(postText, platform, isImage) },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => response.statusText);
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content ?? '';

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`CTTO oracle returned no JSON block. Raw response:\n${raw}`);

  let parsed;
  try {
    parsed = JSON.parse(match[0]);
  } catch (e) {
    throw new Error(`CTTO oracle returned malformed JSON: ${e.message}\nRaw block:\n${match[0]}`);
  }

  return parsed;
}

export function analyze(text) {
  if (!text || text.trim().length < 5) return null;

  const clean = text.trim();
  const h = djb2(clean);
  const words = clean.split(/\s+/).length;

  const hasTech = /\b(AI|ML|blockchain|crypto|startup|disrupt|pivot|scale|SaaS|GPT|engineer|developer|10x|hustle|grind|founder|VC|unicorn|agile|sprint|leverage|synergy|bandwidth)\b/i.test(clean);
  const hasHumility = /\b(wrong|sorry|mistake|learn|question|help|advice|confused)\b/i.test(clean);
  const hasHotTake = /\b(actually|unpopular|controversial|hot take|truth|real talk|nobody|everyone|always|never|biggest|worst|best)\b/i.test(clean);
  const hasLinkedin = /\b(grateful|blessed|journey|inspire|passion|excited to announce|thrilled|humbled|perspective|growth mindset)\b/i.test(clean);

  const virality = clamp(
    seededInt(h, 30, 65) + (hasHotTake ? 20 : 0) + (hasTech ? 10 : 0) + (words > 100 ? -10 : 5),
    10, 99
  );
  const controversy = clamp(
    seededInt(h + 1, 25, 60) + (hasHotTake ? 25 : 0) + (hasTech ? 10 : 0) + (hasHumility ? -15 : 0),
    10, 99
  );
  const cringe = clamp(
    seededInt(h + 2, 20, 55) + (hasLinkedin ? 30 : 0) + (hasTech ? 10 : 0) + (hasHumility ? -10 : 5),
    10, 99
  );
  const dunningKruger = clamp(
    seededInt(h + 3, 30, 70) + (hasTech && hasHotTake ? 20 : 0) + (hasHumility ? -20 : 0),
    10, 99
  );
  const basedness = clamp(
    seededInt(h + 4, 20, 65) + (hasHotTake ? 15 : 0) + (hasHumility ? 10 : 0) + (hasLinkedin ? -15 : 0),
    10, 99
  );
  const ratioRisk = clamp(
    seededInt(h + 5, 20, 60) + (controversy > 70 ? 25 : 0) + (cringe > 70 ? 15 : 0) + (hasLinkedin ? 10 : 0),
    10, 99
  );

  const numSubreddits = 4;
  const shuffled = [...SUBREDDIT_POOL].sort((a, b) => djb2(a.name + h) - djb2(b.name + h));
  const subreddits = shuffled.slice(0, numSubreddits).map((sub, i) => ({
    ...sub,
    upvotes: seededInt(h + i * 17, 100, 9800),
    comments: seededInt(h + i * 31, 10, 890),
    reaction: getReaction(sub.vibe, cringe, controversy),
  }));

  const numTags = clamp(seededInt(h + 99, 2, 5), 2, 5);
  const tagsSorted = [...MEME_TAG_POOL].sort((a, b) => djb2(a + h) - djb2(b + h));
  const memeTags = tagsSorted.slice(0, numTags);

  const quotesSorted = [...ROAST_QUOTE_TEMPLATES].sort((a, b) => djb2(a.author + h) - djb2(b.author + h));
  const quotes = quotesSorted.slice(0, 3).map((q, i) => ({
    author: q.author,
    text: q.getText(seededInt(h + i * 43, 47, 12000)),
  }));

  const overallScore = Math.round((virality + controversy + cringe + dunningKruger) / 4);
  const verdictLevel = overallScore >= 70 ? 'nuclear' : overallScore >= 45 ? 'spicy' : 'mild';

  return {
    metrics: { virality, controversy, cringe, dunningKruger, basedness, ratioRisk },
    radarData: [
      { metric: 'Virality', score: virality },
      { metric: 'Controversy', score: controversy },
      { metric: 'Cringe', score: cringe },
      { metric: 'D-K Index', score: dunningKruger },
      { metric: 'Based', score: basedness },
      { metric: 'Ratio Risk', score: ratioRisk },
    ],
    subreddits,
    memeTags,
    quotes,
    overallScore,
    verdictLevel,
    verdict: VERDICT_LEVELS[verdictLevel],
    charCount: clean.length,
    wordCount: words,
  };
}
