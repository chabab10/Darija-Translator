const API_ENDPOINT = "http://localhost:5000/translate";

document.getElementById('translateBtn').onclick = async () => {
  const inputText = document.getElementById('inputText').value.trim();
  const outputText = document.getElementById('outputText');
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';
  outputText.textContent = '';
  if (!inputText) {
    errorMsg.textContent = 'Please enter English text.';
    return;
  }
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: inputText, mode: 'brief' })
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('translate failed', err);
      errorMsg.textContent = err.error || err.details || 'Translation failed.';
      return;
    }
    const data = await response.json();
    console.log('translate response', data);
    outputText.textContent = data.translatedText || data.darijaTranslation || '';
  } catch (e) {
    errorMsg.textContent = 'Network or server error.';
  }
};

document.getElementById('readAloudBtn').onclick = () => {
  const outputEl = document.getElementById('outputText');
  const text = outputEl.textContent.trim();
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';
  if (!text) {
    errorMsg.textContent = 'No translation available to read.';
    return;
  }

  const speakNow = (voice) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    else utterance.lang = 'ar-MA';
    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  console.log('available voices', voices);
  if (voices.length === 0) {
    // voices not loaded yet; wait for event
    window.speechSynthesis.onvoiceschanged = () => {
      const loaded = window.speechSynthesis.getVoices();
      const arVoice = loaded.find(v => v.lang && v.lang.startsWith('ar')) || loaded.find(v => /arab/i.test(v.name));
      console.log('voiceschanged, selected', arVoice);
      speakNow(arVoice);
    };
  } else {
    const arVoice = voices.find(v => v.lang && v.lang.startsWith('ar')) || voices.find(v => /arab/i.test(v.name));
    speakNow(arVoice);
  }
};

document.getElementById('speakBtn').onclick = async () => {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    errorMsg.textContent = 'Speech recognition not supported in this context.';
    return;
  }

  // Request microphone access first to ensure permission prompt appears
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    errorMsg.textContent = 'Microphone access denied or unavailable.';
    return;
  }

  try {
    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      document.getElementById('inputText').value = event.results[0][0].transcript;
    };
    recognition.onerror = (event) => {
      errorMsg.textContent = 'Speech recognition error: ' + (event.error || 'unknown');
    };
    recognition.onend = () => {
      // optionally indicate stopped listening
    };
    recognition.start();
  } catch (e) {
    errorMsg.textContent = 'Speech recognition failed to start.';
  }
};
