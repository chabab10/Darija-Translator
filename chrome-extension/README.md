# Darija Translator Chrome Extension

Translate English to Moroccan Arabic (Darija) instantly using your LLM-powered REST API, right from the Chrome side panel.

## Features
- Translate English text to Darija using your Java REST API
- Secure API calls with HTTP Basic Authentication
- Speech-to-text: Speak English and auto-fill input
- Text-to-speech: Read Darija translation aloud
- Modern UI in Chrome's side panel (Manifest V3)

## Installation
1. **Build and run your Java backend** (see server-java/README.md)
2. **Open Chrome** and go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the `chrome-extension` folder
5. (Optional) Add your own icons (icon16.png, icon32.png, etc.) for a polished look

## Usage
- Click the extension icon and "Open Side Panel"
- Enter English text or use the 🎤 Speak button
- Click **Translate** to get the Darija translation
- Click **🔊 Read Aloud** to hear the translation

## Permissions
- `sidePanel`: To show the UI in the browser side panel
- `storage`: (reserved for future features)
- `activeTab`: (reserved for future features)
- `host_permissions`: To call your local REST API

## API Configuration
- The extension is pre-configured to call:
  - `http://localhost:8080/darija-translator-api/api/translator/translate`
  - Username: `admin`
  - Password: `darija-translator-2025`
- To change these, edit `sidepanel.js` in the extension folder

## Security
- Credentials are stored in the extension code for demo/dev only. For production, use OAuth or a secure token flow.

## Troubleshooting
- Make sure your Java backend is running and accessible at the configured URL
- Check the browser console for errors if translation fails
- Ensure your backend allows CORS requests from `chrome-extension://*`

## Extending
- Add more features (history, favorites, multi-language, etc.)
- Connect to other LLMs or local models
- Improve UI/UX with more controls and feedback

## Credits
- Built for the Darija Translator project (2025)
- Uses Chrome Manifest V3 and Web Speech API
