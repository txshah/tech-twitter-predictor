import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { EventEmitter } from 'events';
import { runPipeline } from './services/pipeline.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// In-memory job store: jobId → { emitter, events[] }
const jobs = new Map();

app.post('/predict', upload.single('screenshot'), async (req, res) => {
  const tweetText = req.body.tweetText || '';
  const screenshotBuffer = req.file?.buffer || null;
  const screenshotMimeType = req.file?.mimetype || 'image/png';

  if (!tweetText && !screenshotBuffer) {
    return res.status(400).json({ error: 'Provide tweetText or a screenshot image.' });
  }

  const jobId = crypto.randomUUID();
  const emitter = new EventEmitter();
  const events = [];

  jobs.set(jobId, { emitter, events });

  const emit = (event) => {
    events.push(event);
    emitter.emit('event', event);
  };

  // Fire pipeline detached — do not await
  runPipeline({ tweetText, screenshotBuffer, screenshotMimeType }, emit).catch((err) => {
    emit({ type: 'error', error: err.message });
  });

  res.json({ jobId });
});

app.get('/jobs/:jobId/stream', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Replay buffered events
  for (const evt of job.events) {
    res.write(`data: ${JSON.stringify(evt)}\n\n`);
  }

  // Check if already finished
  const last = job.events.at(-1);
  if (last && (last.type === 'done' || last.type === 'error')) {
    return res.end();
  }

  const onEvent = (evt) => {
    res.write(`data: ${JSON.stringify(evt)}\n\n`);
    if (evt.type === 'done' || evt.type === 'error') {
      res.end();
    }
  };

  job.emitter.on('event', onEvent);
  req.on('close', () => job.emitter.off('event', onEvent));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
