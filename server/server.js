import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Client Gemini
let ai = null;
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Gemini client will not be initialized.');
} else {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Simple request logging for debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  if (req.path === '/translate') console.log('body:', req.body);
  next();
});

app.post("/translate", async (req, res) => {
  const { text, mode } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  let prompt;

  if (mode === "brief") {
    prompt = `
Translate this English text to Moroccan Darija ONLY.
Output exactly ONE word or ONE short sentence in Darija.
Do NOT use English.
Text: "${text}"
`;
  } else if (mode === "detailed") {
    prompt = `
Translate this English text to Moroccan Darija ONLY.
Use detailed, expressive sentences in Darija.
Do NOT include any English words.
Text: "${text}"
`;
  } else {
    return res.status(400).json({ error: "Invalid mode" });
  }

  try {
    if (!ai) {
      const msg = 'GEMINI_API_KEY not configured on server.';
      console.error(msg);
      return res.status(500).json({ error: 'Translation failed', details: msg });
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    console.log('gemini response', response);
    // attempt to read common response shapes
    let text = '';
    if (response && typeof response.text === 'string') text = response.text;
    else if (response && response.output && Array.isArray(response.output) && response.output[0] && response.output[0].content) text = response.output[0].content;
    else if (response && response.candidates && response.candidates[0] && response.candidates[0].content) text = response.candidates[0].content;

    res.json({ translatedText: (text || '').trim(), raw: response }); 
  } catch (err) {
    console.error('translate error', err);
    res.status(500).json({
      error: "Translation failed",
      details: err.message || err.toString(),
      stack: err.stack
    });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
