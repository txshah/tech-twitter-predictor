import { extractTextFromScreenshot } from './ocr.js';
import * as mirofish from './mirofish.js';
import { parseReport } from './parseReport.js';
import { getMockResult } from './mock.js';

export async function runPipeline({ tweetText, screenshotBuffer, screenshotMimeType }, emit) {
  let text = tweetText;

  // OCR step
  if (screenshotBuffer) {
    emit({ type: 'step', step: 'ocr', message: 'Extracting text from screenshot...' });
    text = await extractTextFromScreenshot(screenshotBuffer, screenshotMimeType);
    emit({ type: 'step', step: 'ocr', message: `Got tweet: "${text.slice(0, 80)}..."`, done: true });
  }

  if (!text) throw new Error('No tweet text to analyze.');

  if (process.env.MOCK_MODE === 'true') {
    await getMockResult(text, emit);
    return;
  }

  // 1. Ontology generation
  emit({ type: 'step', step: 'ontology', message: 'Building knowledge graph (ontology)...' });
  const { project_id } = await mirofish.generateOntology(text, screenshotBuffer, screenshotMimeType);
  emit({ type: 'step', step: 'ontology', message: 'Ontology ready', done: true });

  // 2. Graph build
  emit({ type: 'step', step: 'graph_build', message: 'Compiling agent graph...' });
  const { task_id: graphTaskId } = await mirofish.buildGraph(project_id);
  const { graph_id } = await mirofish.pollTask(graphTaskId);
  emit({ type: 'step', step: 'graph_build', message: 'Graph built', done: true });

  // 3. Create simulation
  emit({ type: 'step', step: 'sim_create', message: 'Initializing simulation world...' });
  const { simulation_id } = await mirofish.createSimulation(project_id, graph_id);
  emit({ type: 'step', step: 'sim_create', message: 'Simulation created', done: true });

  // 4. Prepare agents
  emit({ type: 'step', step: 'sim_prepare', message: 'Generating agent profiles...' });
  const { task_id: prepTaskId } = await mirofish.prepareSimulation(simulation_id);
  await mirofish.pollPrepareStatus(prepTaskId);
  emit({ type: 'step', step: 'sim_prepare', message: 'Agents ready', done: true });

  // 5. Run simulation
  emit({ type: 'step', step: 'sim_run', message: 'Running Twitter + Reddit simulation...' });
  await mirofish.startSimulation(simulation_id);
  await mirofish.pollRunStatus(simulation_id);
  emit({ type: 'step', step: 'sim_run', message: 'Simulation complete', done: true });

  // 6. Generate report
  emit({ type: 'step', step: 'report_gen', message: 'Synthesizing prediction report...' });
  const { task_id: reportTaskId } = await mirofish.generateReport(simulation_id);
  await mirofish.pollReportStatus(reportTaskId);
  const { markdown_content } = await mirofish.fetchReport(simulation_id);
  emit({ type: 'step', step: 'report_gen', message: 'Report ready', done: true });

  // 7. Parse metrics
  emit({ type: 'step', step: 'parse', message: 'Extracting prediction metrics...' });
  const metrics = await parseReport(markdown_content, text);
  emit({ type: 'step', step: 'parse', message: 'Metrics extracted', done: true });

  emit({ type: 'done', result: metrics });
}
