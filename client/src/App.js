import React, { useState } from 'react';
import axios from 'axios';
import TranslatorCard from './components/TranslatorCard';

function App() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState(null); // "brief" ou "detailed"
  const [history, setHistory] = useState([]);

  const translate = async (mode) => {
    if (!text) return;
    setActiveMode(mode);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/translate", { text, mode });
      const translated = res.data.translatedText;
      setTranslation(translated);
      setHistory((prev) => [{ mode, original: text, translated }, ...prev]);
    } catch {
      setTranslation("Error translating text");
    }
    setLoading(false);
  };

  return (
<div className="min-h-screen flex justify-center items-center
                bg-gradient-to-br from-blue-300 to-blue-400 p-10">

      <TranslatorCard
        text={text}
        setText={setText}
        translation={translation}
        translateBrief={() => translate("brief")}
        translateDetailed={() => translate("detailed")}
        loading={loading}
        activeMode={activeMode}
        history={history}
      />
    </div>
  );
}

export default App;
