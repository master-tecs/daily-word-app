# Daily Word

A vocabulary app that displays a daily word for each topic you follow, with definitions, examples, synonyms, antonyms, and browser pronunciation.

Built with Next.js 14, React 18, TypeScript, Tailwind CSS, and shadcn/ui. Word data comes from an external n8n webhook; the frontend stores topics and cached words in browser local storage.

## Features

- Add and remove topics such as technology or marketing.
- Reuse each topic’s cached word when its date matches today in UTC.
- Refresh individual topics on demand.
- Read definitions, usage examples, word origins, synonyms, and antonyms.
- Hear pronunciation through the browser’s speech synthesis support.
- Switch between light and dark themes.

## Local development

Install Node.js and npm, then:

```bash
git clone https://github.com/master-tecs/daily-word-app.git
cd daily-word-app
npm ci
```

Create `.env.local`:

```dotenv
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.example/webhook/word
```

Use the full webhook URL without a `topic` query parameter. This variable is included in browser code: the endpoint must be designed for public client access, without embedded credentials.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Webhook contract

The frontend sends a GET request with the selected topic:

```http
GET /webhook/word?topic=technology
```

The response can be an object or an array whose first element is the word object:

```json
{
  "Word": "idempotent",
  "Meaning": "Producing the same result when an operation is repeated.",
  "Synonyms": ["repeat-safe"],
  "Antonyms": [],
  "PartOfSpeech": "Adjective",
  "Date": "2026-10-05",
  "Topic": "technology",
  "Origin": "From Latin idem, meaning the same, and potent.",
  "UsageExample": "An idempotent request can be retried without changing the final result."
}
```

Return the current UTC date in `YYYY-MM-DD` format so the daily cache works as expected. Synonyms and antonyms must be arrays of strings.

Configure n8n separately to retrieve or generate a word and return this response. Google Sheets can store the entries. The repository does not include an exported n8n workflow, and any word-generation or duplicate-prevention rules must be implemented in that external workflow.

For a webhook on another origin, configure CORS to allow the frontend origin and the request’s `Content-Type` header. Without the environment variable, the frontend requests `/webhook/word` on its own origin; this repository does not implement that route, so a separately configured proxy is required.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the application |
| `npm start` | Serve a production build |
| `npm run lint` | Run the configured linter |

## Project structure

| Path | Purpose |
| --- | --- |
| `src/components/WordOfTheDay.tsx` | Topic selection, word cards, pronunciation, and theme controls |
| `src/hooks/useWordOfTheDay.ts` | Webhook requests, response normalization, and local cache |
| `src/app/` | Next.js application routes and layout |
| `public/` | Static assets and service-worker files |

## Limitations

The application needs a working external webhook to fetch words. Browser pronunciation depends on the voices available on the user’s device. Cached data is local to each browser; there is no account-based synchronization.

## License

[MIT](LICENSE).
