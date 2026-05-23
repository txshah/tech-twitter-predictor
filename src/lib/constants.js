export const APP_NAME = 'Crash The Tech Out';
export const TAGLINE = 'Feed it a post. Watch the internet eat them alive.';

export const SUBREDDIT_POOL = [
  { name: 'r/programming', emoji: '💻', vibe: 'pedantic' },
  { name: 'r/cscareerquestions', emoji: '😰', vibe: 'anxious' },
  { name: 'r/ExplainLikeImFive', emoji: '🧒', vibe: 'condescending' },
  { name: 'r/unpopularopinion', emoji: '😤', vibe: 'contrarian' },
  { name: 'r/LinkedInLunatics', emoji: '🤵', vibe: 'horrified' },
  { name: 'r/HailCorporate', emoji: '🤑', vibe: 'suspicious' },
  { name: 'r/techsnark', emoji: '🙄', vibe: 'dismissive' },
  { name: 'r/OutOfTheLoop', emoji: '😕', vibe: 'confused' },
  { name: 'r/startups', emoji: '🚀', vibe: 'hype' },
  { name: 'r/antiwork', emoji: '✊', vibe: 'furious' },
];

export const MEME_TAG_POOL = [
  'Dunning-Kruger Approved',
  'LinkedIn Energy',
  'Main Character Syndrome',
  'Hot Take Verified',
  'Ratio Risk: High',
  'Cringe Secured',
  'Thought Leader Material',
  'Certified Yikes',
  'Hustle Culture Artifact',
  'Cope Detected',
  'Touch Grass Advisory',
  'Bold and Brainless',
  'Sigma Fail',
  'GPT Ghost-Written',
  'Clout Chasing',
  'Big "Actually" Energy',
];

export const ROAST_QUOTE_TEMPLATES = [
  {
    author: 'r/programming top comment',
    getText: (n) => `"This is why I drink." [${n} upvotes]`,
  },
  {
    author: 'Random Twitter user',
    getText: (n) => `"Delete this." [${n} retweets]`,
  },
  {
    author: 'Hacker News poster',
    getText: () => `"I worked at a FAANG for 12 years and this is embarrassing." [flagged]`,
  },
  {
    author: 'LinkedIn mutual',
    getText: (n) => `"So inspiring! I resonated with this on a cellular level." [${n} reactions]`,
  },
  {
    author: 'Anonymous 4chan user',
    getText: (n) => `"rent free in my head. calling my therapist." [${n} (you)s]`,
  },
  {
    author: 'TikTok commenter',
    getText: (n) => `"POV: you peaked in your intro CS class" [${n} likes]`,
  },
  {
    author: 'Tech influencer reply',
    getText: (n) => `"Agree to disagree. Blocked." [${n} quote tweets]`,
  },
  {
    author: 'Concerned Stack Overflow mod',
    getText: (n) => `"This question shows no research effort. -${n} votes."`,
  },
];

export const EXAMPLES = [
  {
    name: 'Sam Altman',
    text: `We are on the cusp of something that will be recognized as the most important technological transition in human history. The models are improving faster than anyone — including us — expected. I genuinely believe we will have AGI within the next few years. This is not hype. This is what the benchmarks show, what the researchers tell me, and what I see every day. Buckle up.`,
  },
  {
    name: 'Elon Musk',
    text: `The mainstream media wants you to believe X is dying. We just hit an all-time record for user engagement. The difference? Real speech. No algorithmic suppression of ideas the regime finds inconvenient. The advertisers who left because they demanded censorship — good riddance. We don't need them. The people who stayed understand that free expression is not a bug. It is the product.`,
  },
  {
    name: 'Jensen Huang',
    text: `Every company in the world is now an AI company whether they know it or not. The ones who fail to invest in AI infrastructure over the next 18 months will not get a second chance. Blackwell demand continues to exceed all supply projections by a significant margin. We are not in a hype cycle. We are in the middle of a platform shift larger than the transition to mobile. NVIDIA is building the engine of the next industrial revolution.`,
  },
  {
    name: 'Jeff Bezos',
    text: `People ask me what keeps me motivated after all these years. Here's the truth: we haven't even started yet. Blue Origin just completed its 25th successful crewed mission. Amazon now delivers to 99% of the US population same-day or next-day. The question has never been whether we can build the future — it's whether we're moving fast enough. Looking at the numbers this morning, I think we are.`,
  },
];

export const VERDICT_LEVELS = {
  mild: {
    label: 'Mostly Harmless',
    color: '#00e676',
    emoji: '🟢',
    description: 'The internet will scroll past this. Mild roasting, at best.',
  },
  spicy: {
    label: 'Certified Spicy',
    color: '#ff9800',
    emoji: '🟠',
    description: "You're going to get quote-tweeted into oblivion. Godspeed.",
  },
  nuclear: {
    label: 'NUCLEAR TAKE',
    color: '#ff1744',
    emoji: '🔴',
    description: "Congratulations. You've broken the internet. Delete immediately.",
  },
};
