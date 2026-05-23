import { useState, useRef } from 'react';
import PipelineStatus from './components/PipelineStatus.jsx';
import ResultsView from './components/ResultsView.jsx';

export default function App() {
  const [appState, setAppState] = useState('idle'); // idle | loading | done | error
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [tweetText, setTweetText] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const esRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removeImage() {
    setScreenshotFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  function handleReset() {
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setAppState('idle');
    setSteps([]);
    setCurrentStep(null);
    setResult(null);
    setErrorMsg('');
    setTweetText('');
    setScreenshotFile(null);
    setPreviewUrl(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tweetText.trim() && !screenshotFile) return;

    setAppState('loading');
    setSteps([]);
    setCurrentStep(null);

    const form = new FormData();
    if (tweetText.trim()) form.append('tweetText', tweetText.trim());
    if (screenshotFile) form.append('screenshot', screenshotFile);

    let jobId;
    try {
      const res = await fetch('/predict', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      ({ jobId } = await res.json());
    } catch (err) {
      setErrorMsg(err.message);
      setAppState('error');
      return;
    }

    const es = new EventSource(`/jobs/${jobId}/stream`);
    esRef.current = es;

    es.onmessage = (e) => {
      const event = JSON.parse(e.data);

      if (event.type === 'step') {
        if (event.done) {
          setSteps((prev) => [...prev, event.message]);
          setCurrentStep(null);
        } else {
          setCurrentStep(event.message);
        }
      } else if (event.type === 'done') {
        setResult(event.result);
        setAppState('done');
        es.close();
      } else if (event.type === 'error') {
        setErrorMsg(event.error || 'Something went wrong.');
        setAppState('error');
        es.close();
      }
    };

    es.onerror = () => {
      setErrorMsg('Lost connection to server.');
      setAppState('error');
      es.close();
    };
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Tech Twitter Predictor</h1>
        <p className="app-subtitle">Drop a tweet — we'll simulate how the internet reacts</p>
      </header>

      {appState === 'idle' && (
        <div className="card">
          <form className="input-form" onSubmit={handleSubmit}>
            <div>
              <label className="input-label">Tweet text</label>
              <textarea
                className="tweet-textarea"
                placeholder="Paste the tweet here..."
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
              />
            </div>

            <div className="divider">or</div>

            <div>
              <label className="input-label">Screenshot</label>
              <div className="file-drop">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <p className="file-drop-text">
                  {screenshotFile
                    ? screenshotFile.name
                    : <>Drop image or <span>click to browse</span></>}
                </p>
              </div>
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="preview" />
                  <button type="button" className="remove-image-btn" onClick={removeImage}>Remove</button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={!tweetText.trim() && !screenshotFile}
            >
              Predict the internet's reaction →
            </button>
          </form>
        </div>
      )}

      {appState === 'loading' && (
        <div className="card">
          <PipelineStatus steps={steps} currentStep={currentStep} />
        </div>
      )}

      {appState === 'done' && result && (
        <ResultsView result={result} onReset={handleReset} />
      )}

      {appState === 'error' && (
        <div className="card error-card">
          <p className="error-title">Simulation failed</p>
          <p className="error-msg">{errorMsg}</p>
          <button className="retry-btn" onClick={handleReset}>Try Again</button>
        </div>
      )}
    </div>
  );
}
