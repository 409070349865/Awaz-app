# Awaz (آواز) — Real-Time Voice Translator

Awaz is a full-stack, real-time voice translation application. It combines a beautiful, responsive frontend UI using the Web Speech API with a robust Node.js/Express backend that securely integrates multiple translation engines and logs translation history in a MongoDB database.

![Awaz App](https://img.shields.io/badge/Status-Active-success)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)

---

## 🌟 Features

- **🎙️ Real-Time Speech Recognition**: Speak directly into your microphone, and Awaz instantly transcribes it.
- **🌍 Multi-Engine Translation**: Powered by a pluggable backend supporting LibreTranslate, Google Cloud, DeepL, and OpenAI.
- **🔊 Text-to-Speech (TTS)**: Plays back the translated audio with adjustable speed and volume controls.
- **📊 Translation Analytics**: Beautiful real-time charts showing your translation activity, latency, and language usage.
- **🎓 Language Learning Hub**: Structured mini-lessons with grammar tips and vocabulary for popular languages.
- **🕒 Translation History**: Automatically saves your translation logs in a MongoDB database so you can view your recent translations across sessions.

---

## 📁 Project Structure

```
Awaz-app/
├── Awaz-frontend/
│   └── index.html            ← The entire frontend application (HTML/CSS/JS)
├── awaz-backend/
│   ├── package.json
│   ├── .env.example          ← Template for environment variables
│   └── server/               
│       ├── server.js         ← Express backend entry point
│       ├── config/db.js      ← MongoDB connection logic
│       ├── models/           ← Mongoose schemas (Translation history)
│       └── routes/           ← API Endpoints (/translate, /history)
└── README.md
```

---

## 🚀 How to Run Locally

Follow these steps to get the full stack running on your local machine.

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **MongoDB** (You must have MongoDB running locally, or a MongoDB Atlas URI)

### 1. Setup the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd awaz-backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables:
   Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and verify your MongoDB URI and Translation engine settings:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/awaz
   TRANSLATE_ENGINE=libretranslate  # Default free engine
   ```
4. Start the backend server (starts on `http://localhost:3000`):
   ```bash
   npm run dev
   ```
   *You should see a message confirming the server is running and MongoDB is connected.*

### 2. Run the Frontend
The frontend is built and served directly by the backend Express server. You do not need to start a separate frontend server or build process!

1. Make sure your backend is running (`npm run dev` in the `awaz-backend` folder).
2. Open your web browser and go to: **[http://localhost:3000](http://localhost:3000)**

*That's it! The full-stack app is now completely live.*

### 3. Start Translating!
1. Click the microphone button in the app and speak.
2. The app will capture your voice, send the text to your local backend, translate it, and save the log in MongoDB.
3. Check the **History** tab to see your translation logs synced from the database!

---

## ⚙️ Translation Engines

By default, the backend uses `libretranslate` which is free and does not require an API key. 
If you want higher quality or faster translations, edit the `TRANSLATE_ENGINE` in your `.env` file:

| Engine | Key required | Notes |
|---|---|---|
| `libretranslate` | Optional | Great for getting started, free. |
| `google` | ✅ Yes | Very fast, highly accurate. |
| `deepl` | ✅ Yes | DeepL provides incredibly natural translations. |
| `openai` | ✅ Yes | Uses GPT models for flexible translations. |

---

## 🤝 Contributing
Feel free to submit pull requests or open issues to improve the application!