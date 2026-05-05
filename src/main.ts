import './style.css';

const youtubeUrlInput = document.getElementById('youtube-url') as HTMLInputElement;
const analyzeBtn = document.getElementById('analyze-btn') as HTMLButtonElement;
const errorMsg = document.getElementById('error-msg') as HTMLParagraphElement;
const resultsSection = document.getElementById('results') as HTMLElement;
const loadingDiv = document.getElementById('loading') as HTMLDivElement;
const resultsContent = document.getElementById('results-content') as HTMLDivElement;

function showError(msg: string): void {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

function hideError(): void {
  errorMsg.classList.add('hidden');
}

function getApiKeys(): { youtubeKey: string; openaiKey: string } | null {
  const youtubeKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!youtubeKey || !openaiKey) {
    const missing: string[] = [];
    if (!youtubeKey) missing.push('VITE_YOUTUBE_API_KEY');
    if (!openaiKey) missing.push('VITE_OPENAI_API_KEY');
    showError(`Missing required environment variables: ${missing.join(', ')}. Set them in .env.local.`);
    return null;
  }

  return { youtubeKey, openaiKey };
}

export function extractVideoId(url: string): string | null {
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  return null;
}

function setLoading(loading: boolean, text = 'Fetching comments...'): void {
  const loadingText = document.getElementById('loading-text') as HTMLParagraphElement;
  loadingText.textContent = text;
  if (loading) {
    resultsSection.classList.remove('hidden');
    loadingDiv.classList.remove('hidden');
    resultsContent.innerHTML = '';
  } else {
    loadingDiv.classList.add('hidden');
  }
}

analyzeBtn.addEventListener('click', async () => {
  hideError();

  const keys = getApiKeys();
  if (!keys) return;

  const url = youtubeUrlInput.value.trim();
  if (!url) {
    showError('Please enter a YouTube video URL.');
    return;
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    showError('Invalid YouTube URL. Please use youtube.com/watch?v= or youtu.be/ format.');
    return;
  }

  setLoading(true);
  resultsContent.innerHTML = `<p>Video ID: <strong>${videoId}</strong> — analysis coming soon.</p>`;
  setLoading(false);
});
