const BASE_URL = process.env.MIROFISH_BASE_URL || 'http://localhost:5001';
const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // 5 min default

async function mfetch(path, options = {}) {
  const url = `${BASE_URL}/api${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Mirofish ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

async function pollUntilDone(checkFn, isDone, timeoutMs = POLL_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    const result = await checkFn();
    if (isDone(result)) return result;
  }
  throw new Error('Polling timed out');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generateOntology(tweetText, screenshotBuffer, mimeType) {
  const form = new FormData();
  const txtBlob = new Blob([tweetText], { type: 'text/plain' });
  form.append('files', txtBlob, 'tweet.txt');
  if (screenshotBuffer) {
    const imgBlob = new Blob([screenshotBuffer], { type: mimeType });
    form.append('files', imgBlob, 'screenshot.png');
  }
  form.append(
    'simulation_requirement',
    'Predict how Twitter and Reddit users will react to this tech tweet. Analyze stock sentiment, meme potential, clout gain, FUD/dunking, and subreddit activity.',
  );
  form.append('project_name', `tweet_${Date.now()}`);

  const result = await mfetch('/graph/ontology/generate', { method: 'POST', body: form });
  return result.data;
}

export async function buildGraph(projectId) {
  const result = await mfetch('/graph/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_id: projectId }),
  });
  return result.data;
}

export async function pollTask(taskId) {
  const result = await pollUntilDone(
    () => mfetch(`/graph/task/${taskId}`),
    (r) => r.data?.status === 'completed' || r.data?.status === 'failed',
  );
  if (result.data?.status === 'failed') throw new Error('Graph build task failed');
  return result.data?.result ?? result.data;
}

export async function createSimulation(projectId, graphId) {
  const result = await mfetch('/simulation/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project_id: projectId,
      graph_id: graphId,
      enable_twitter: true,
      enable_reddit: true,
    }),
  });
  return result.data;
}

export async function prepareSimulation(simulationId) {
  const result = await mfetch('/simulation/prepare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ simulation_id: simulationId, use_llm_for_profiles: true }),
  });
  return result.data;
}

export async function pollPrepareStatus(taskId) {
  return pollUntilDone(
    () =>
      mfetch('/simulation/prepare/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      }),
    (r) => {
      const s = r.data?.status;
      return s === 'completed' || s === 'ready' || s === 'done';
    },
    8 * 60 * 1000,
  );
}

export async function startSimulation(simulationId) {
  return mfetch('/simulation/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ simulation_id: simulationId, enable_twitter: true, enable_reddit: true }),
  });
}

export async function pollRunStatus(simId) {
  return pollUntilDone(
    () => mfetch(`/simulation/${simId}/run-status`),
    (r) => {
      const s = r.data?.status;
      return s === 'completed' || s === 'finished' || s === 'done';
    },
    10 * 60 * 1000,
  );
}

export async function generateReport(simulationId) {
  const result = await mfetch('/report/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ simulation_id: simulationId }),
  });
  return result.data;
}

export async function pollReportStatus(taskId) {
  return pollUntilDone(
    () =>
      mfetch('/report/generate/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      }),
    (r) => {
      const s = r.data?.status;
      return s === 'completed' || s === 'done';
    },
  );
}

export async function fetchReport(simId) {
  const result = await mfetch(`/report/by-simulation/${simId}`);
  return result.data;
}
