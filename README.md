# Daily Word App

An application that helps users improve their vocabulary by providing a new word daily. Users can fetch and store a word for the current day, including its definition, pronunciation, synonyms, and more. The app generates a new word each day if a word for that day has not been stored yet.

## Features

- **Daily Word Fetch**: Fetches a new word every day from the backend.
- **Local Storage Integration**: Stores the word in local storage if it matches the current date, avoiding unnecessary API requests.
- **Generate New Word**: Uses Google Gimini AI to generate a new word in case the word for the day is not available.
- **Pronunciation Button**: Users can click a button to hear the pronunciation of the word using the Web Speech API.

## Tech Stack

- **Frontend**: React with TypeScript, Next.js
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB (used to store the words)
- **AI Module**: Integrated with a language model to generate new words
- **Deployment**: (If deployed, mention here e.g., Vercel, Heroku, etc.)

## Installation and Setup

### Prerequisites

- **Node.js** and **npm** installed on your local machine.
- **MongoDB** instance running locally or on the cloud (you can use MongoDB Atlas).

### Steps to Set Up Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/master-tecs/daily-word-app.git

2. Navigate to the project directory:
   
    ```bash
    cd daily-word-app
    
3. 	Install dependencies:
   
    ```bash
    npm install
    
4. 	Set up environment variables:
  Create a .env file at the root of the project and add your MongoDB URI and any API keys you might need.

  ```bash
  MONGODB_URI=your_mongo_db_connection_string
  AI_API_KEY=your_ai_api_key (if applicable)

5. Run the development server:

   ```bash
   npm run dev

The app will now be running locally at http://localhost:3000.

API Endpoints

/api/words [GET]

	•	Fetches the latest word stored in the database for the current day.
	•	Response:
    ```bash
    {
  "success": true,
  "word": {
    "word": "exemplary",
    "meaning": "serving as a desirable model; representing the best of its kind.",
    "example": "His exemplary work ethic inspired the whole team.",
    "synonyms": ["ideal", "model", "commendable"],
    "antonyms": ["bad", "dishonorable"],
    "pronunciation": "eg-zem-pluh-ree",
    "origin": "Late 16th century: from late Latin 'exemplaris', from 'exemplum' meaning 'example'.",
    "date": "2024-10-12T00:00:00.000Z"
  }
}```

/api/words [POST]

	•	Saves a new word with all required metadata.
	•	Request body:
    ```bash
    {
  "word": "exemplary",
  "meaning": "serving as a desirable model; representing the best of its kind.",
  "example": "His exemplary work ethic inspired the whole team.",
  "wordType": "adjective",
  "synonyms": ["ideal", "model", "commendable"],
  "antonyms": ["bad", "dishonorable"],
  "pronunciation": "eg-zem-pluh-ree",
  "origin": "Late 16th century: from late Latin 'exemplaris', from 'exemplum' meaning 'example'.",
  "date": "2024-10-12"
}```

Usage

	1.	Open the app to see the word of the day along with its meaning, example usage, synonyms, antonyms, and origin.
	2.	Click on the Pronounce button to hear the word’s pronunciation using the Web Speech API.
	3.	If no word is available for the current day, the app generates a new word and stores it.

Pronunciation Feature

The app uses the Web Speech API to enable text-to-speech functionality. When a user clicks on the pronunciation button, the app will pronounce the word out loud in the browser.

Screenshots

(Add screenshots of the app here if available. Example format below.)

Main Screen

Running Tests

(Coming...)

```bash
npm run test```

License

This project is licensed under the MIT License - see the LICENSE file for details.

Author

	•	Abdul-Wahab Abdutrasheed - GitHub

Contributions

Contributions are welcome! Feel free to submit a pull request or open an issue for suggestions or improvements.

---
