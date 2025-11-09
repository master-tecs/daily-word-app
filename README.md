# Daily Word App

An application that helps users improve their vocabulary by providing topic-specific words every day. The frontend caches each topic’s “word of the day” locally and calls an n8n webhook backed by Google Sheets only when the cache is missing or stale. The webhook makes sure there is one unique word per topic per day and can generate new entries through AI.

- **Multi-topic support**: Users can track multiple topics (technology, marketing, etc.) and receive a dedicated word card for each.
- **Daily Word Fetch**: Fetches a new word every day from the n8n webhook. If a cached entry exists for today, the API is not called.
- **Local Storage Caching**: Stores the word (per topic) in `localStorage` to avoid unnecessary webhook calls.
- **Serverless Backend**: n8n + Google Sheets store and serve the daily word as a lightweight backend.
- **Pronunciation Button**: Users can click a button to hear the pronunciation of the word using the Web Speech API.
- **Dark mode & UI polish**: Toggle dark/light mode, synonyms/antonyms tabs, and rich card-based design.

## Tech Stack

- **Frontend**: React with TypeScript, Next.js, shadcn/ui components
- **Serverless backend**: n8n webhook orchestrating Google Sheets + AI generation
- **Storage**: Google Sheets (persistent store) + browser `localStorage` (per-topic cache)
- **Deployment**: (If deployed, mention here e.g., Vercel, n8n Cloud, etc.)

## Installation and Setup

### Prerequisites

- **Node.js** and **npm** installed on your local machine.
- **n8n** instance (self-hosted or cloud) connected to a Google Sheet.
- **Google Service Account** credentials configured in n8n for Google Sheets access.

### Steps to Set Up Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/master-tecs/daily-word-app.git

2. **Navigate to the project directory:**
   
    ```bash
    cd daily-word-app
    
3. **Install dependencies:**
   
    ```bash
    npm install
    
4. **Set up environment variables:**
 Create a `.env.local` file at the root and add your n8n webhook URL (the full endpoint n8n exposes, without the `topic` query parameter).
   
   ```bash
   NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL=https://n8n.srv1091639.hstgr.cloud/webhook-test/c2e4756f-4772-414f-b377-86a6392d6565
   ```
   
5. **Run the development server:**

   ```bash
   npm run dev


### Where its running
The app will now be running locally at http://localhost:3000.


## Serverless API Flow

### n8n Webhook

`GET /webhook/word?topic={topic}` (if you prefer running through a local proxy)  
`GET https://n8n.srv1091639.hstgr.cloud/webhook-test/c2e4756f-4772-414f-b377-86a6392d6565?topic={topic}` (example direct webhook)

- Looks up today’s word for the specified topic in Google Sheets.
- If found, returns the cached row.
- If missing, generates a new word (via your chosen AI node), appends it to the sheet, and returns the new entry.
- Ensures a unique word per topic per day and avoids reusing words from the last 40 days.

Example request:

```
GET https://your-n8n-instance.com/webhook/word?topic=technology
```

Example response (compatible with the frontend):

```json
[
  {
    "Word": "Automatronic",
    "Meaning": "Relating to the integration of automation and electronics in technology.",
    "Synonyms": ["robotic", "automated"],
    "Antonyms": ["manual", "analog"],
    "PartOfSpeech": "Adjective",
    "Date": "2025-11-09",
    "Topic": "tech",
    "Origin": "Blend of 'automatic' and 'electronic'",
    "UsageExample": "The company introduced a new automatronic system that streamlined the manufacturing process."
  }
]
```

## Usage

1. Open the app to see the word of the day for each topic you have selected.
2. Click the Pronounce button to hear the word’s pronunciation using the Web Speech API.
3. The app caches each topic locally to avoid repeat webhook calls during the day.

## Switching from MongoDB to n8n + Google Sheets

1. **Remove MongoDB-specific code** (completed):
   - Deleted `src/app/api/words` API route and the `mongodb`/`mongoose` utilities.
   - Removed `@google/generative-ai`, `axios`, `mongodb`, and `mongoose` dependencies.
2. **Provision Google Sheet**:
   - Create a sheet with columns such as `date`, `topic`, `word`, `meaning`, `usage`, `partOfSpeech`, `synonyms`, `antonyms`, `pronunciation`, `origin`.
3. **Configure n8n workflow**:
   - **Trigger**: Webhook node (`GET /webhook/word`).
   - **Lookup**: Google Sheets node filters by `topic` and today’s date.
   - **Decision**:
     - If found: return the existing row as JSON.
     - If not: call an AI node (Gemini/OpenAI) to generate a new word, append it to the sheet, and respond with the new entry.
   - **Deduplication**: Use a Google Sheets filter (or n8n Function node) to ensure no word repeats within the last 40 days.
4. **Configure environment**:
   - Set `NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL` so the frontend can call your n8n workflow.
5. **Deploy**:
   - Redeploy the Next.js app and n8n workflow.
   - Clear any existing `localStorage` cache if you previously stored MongoDB entries.

## Pronunciation Feature

The app uses the Web Speech API to enable text-to-speech functionality. When a user clicks on the pronunciation button, the app will pronounce the word out loud in the browser.

## Contributions

Contributions are welcome! Feel free to submit a pull request or open an issue for suggestions or improvements.
