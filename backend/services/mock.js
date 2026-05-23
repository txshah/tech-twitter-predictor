const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PIPELINE_STEPS = [
  { step: 'ontology', message: 'Building knowledge graph (ontology)...' },
  { step: 'graph_build', message: 'Compiling agent graph...' },
  { step: 'sim_create', message: 'Initializing simulation world...' },
  { step: 'sim_prepare', message: 'Generating agent profiles...' },
  { step: 'sim_run', message: 'Running Twitter + Reddit simulation...' },
  { step: 'report_gen', message: 'Synthesizing prediction report...' },
  { step: 'parse', message: 'Extracting prediction metrics...' },
];

const DELAYS = [600, 900, 500, 1400, 2200, 1800, 700];

const MOCK_SUBREDDITS = [
  { name: 'r/wallstreetbets', sentiment: 'bullish' },
  { name: 'r/technology', sentiment: 'neutral' },
  { name: 'r/ProgrammerHumor', sentiment: 'meme' },
  { name: 'r/singularity', sentiment: 'bullish' },
  { name: 'r/investing', sentiment: 'bearish' },
];

const MOCK_MEMES = [
  [
    'This Is Fine dog (developer watching deployment logs)',
    'Wojak crying at stock chart after reading this',
    'Drake pointing at "vibes-based investing" over fundamentals',
  ],
  [
    '"We\'re so back" / "It\'s so over" split panel',
    'Distracted Boyfriend (VC staring at AI startup)',
    'Galaxy Brain Pepe making 47-move plan from one tweet',
  ],
  [
    'Guy tapping head: ignoring red flags, aping into the stock',
    'Two buttons sweating: FOMO vs not losing rent money',
    'Stonks meme with rocket ship and moon emoji',
  ],
];

const MOCK_VERDICTS = [
  "This will get ratio'd by the first reply, spark 3 LinkedIn thought-leader thinkpieces, and pump the stock 2% in after-hours.",
  'Tech Twitter will dunk on it for 6 hours then forget it exists; WSB will ape in anyway.',
  'Goes viral in niche circles, inspires a wave of copycat tweets, and someone turns it into a browser extension.',
  'The reply guys arrive within minutes, r/ProgrammerHumor makes it a meme template, and the stock barely moves.',
];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function getMockResult(tweetText, emit) {
  for (let i = 0; i < PIPELINE_STEPS.length; i++) {
    const { step, message } = PIPELINE_STEPS[i];
    emit({ type: 'step', step, message });
    await sleep(DELAYS[i]);
    emit({ type: 'step', step, message: message.replace('...', ''), done: true });
  }

  const subreddits = MOCK_SUBREDDITS.map((s) => ({
    ...s,
    score: rand(35, 92),
  })).sort((a, b) => b.score - a.score);

  const metrics = {
    stockBuyIntent: rand(42, 88),
    memePotential: rand(58, 96),
    cloutGain: rand(50, 85),
    fudFactor: rand(18, 65),
    twitterSentiment: rand(44, 82),
    redditSentiment: rand(38, 78),
    subreddits,
    topMemes: pick(MOCK_MEMES),
    verdict: pick(MOCK_VERDICTS),
    tweetText,
  };

  emit({ type: 'done', result: metrics });
}
