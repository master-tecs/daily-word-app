"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiChatSession } from "@/service/AiModule";
import Image from "next/image";
import avatarImg from './images/placeholder.jpg';
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Word {
  word: string;
  wordType: string;
  meaning: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  origin: string;
  pronunciation: string; 
}

export default function Component() {
  const [word, setWord] = useState<Word | null>(null);

  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

useEffect(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to 12:00 AM

  const storedWordData = localStorage.getItem('wordOfTheDay');
  
  if (storedWordData) {
    const parsedWordData = JSON.parse(storedWordData);
    const storedDate = new Date(parsedWordData.date).toISOString().split('T')[0];
    const currentDate = today.toISOString().split('T')[0];

    // Check if the word in localStorage is for the current day
    if (storedDate === currentDate) {
      setWord(parsedWordData.word);
      console.log('Using word from localStorage:', parsedWordData.word);
      return; // No need to fetch or generate a new word
    }
  }

  // If no word in localStorage or the word is not for today, fetch or generate a new word
  getLatestWord(today);
}, []);

const getLatestWord = async (date: Date) => {
  try {
    const saveResponse = await axios.get('/api/words');
    console.log({ saveResponse });

    if (saveResponse.status === 200 && saveResponse.data.success === true) {
      const fetchedWordDate = saveResponse.data.word.date.split('T')[0]; // Extract only the date part
      const currentDate = date.toISOString().split('T')[0];

      if (fetchedWordDate === currentDate) {
        setWord(saveResponse.data.word);
        console.log('Word is for the same day');

        // Save the word in localStorage
        localStorage.setItem('wordOfTheDay', JSON.stringify({
          word: saveResponse.data.word,
          date: saveResponse.data.word.date,
        }));
      } else {
        console.log('Word is from a different day');
        generateNewWord(date);
      }
    } else if (saveResponse.status === 401) {
      // Word for the day already exists but we need a new one
      console.log('Word for the same date already exists');
      generateNewWord(date);
    } else {
      console.log('Failed to fetch word, generating new one');
      generateNewWord(date);
    }

    console.log('Word processed successfully:', saveResponse.data);
  } catch (error) {
    console.error('Error fetching or saving word:', error);
    generateNewWord(date); // In case of any error, try generating a new word
  }
};

const generateNewWord = async (date: Date) => {
  const prompt = "Give me a word of the day in one of these fields: business, technology, marketing, sales, or innovation in JSON format that I can use in my daily life to improve my vocabulary. Include the meaning, example in a sentence, word type, synonyms, antonyms, pronunciation and origin.";

  try {
    // Generate the word from AI module
    const result = await AiChatSession.sendMessage(prompt);
    
    // Assuming result.response.text() gives a JSON string, we parse it
    const jsonResponse = await result.response.text();
    const parsedWord: Word = JSON.parse(jsonResponse);

    // Update the word state with the parsed JSON data
    setWord(parsedWord);
    console.log({ parsedWord });

    // Send the generated word and the date to the backend
    let saveResponse;
    try {
      saveResponse = await axios.post('/api/words', {
        word: parsedWord.word,
        meaning: parsedWord.meaning,
        example: parsedWord.example,
        wordType: parsedWord.wordType, // Ensure this matches your parsed data structure
        synonyms: parsedWord.synonyms,
        antonyms: parsedWord.antonyms,
        pronunciation: parsedWord.word || "Nothing!",
        origin: parsedWord.origin,
        date: date, // Adding today's date with 12:00 AM time
      });

      console.log('Word saved successfully:', saveResponse.data);

      // Save the word in localStorage
      localStorage.setItem('wordOfTheDay', JSON.stringify({
        word: parsedWord,
        date: date.toISOString(),
      }));
    } catch (error) {
      console.error('Error saving word:', error);
    }

  } catch (error) {
    console.error('Failed to fetch, parse, or save word:', error);
  }
};

const pronounceWord = (word: string) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US'; // Set language, you can adjust it to any other language if needed
  window.speechSynthesis.speak(utterance);
};

  if (!word) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-[#f0efe9]'}`}>
      <Card className={`w-full max-w-md shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-[#faf7e8]'}`}>
        <CardHeader className="relative">
          {/* <div className="absolute top-4 left-4 text-gray-500 text-sm">09:00</div> */}
          <div className="absolute top-4 right-4 flex space-x-1">
            {/* <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <div className="w-6 h-4 bg-gray-500 rounded-full"></div> */}
          </div>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className={`text-3xl font-serif ${darkMode ? 'text-white' : 'text-black'}`}>Word of the Day</CardTitle>
            <div className="flex items-center space-x-2">
              <Sun className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label="Toggle dark mode"
              />
              <Moon className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>
          </div>
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>«{word.word}»</h2>
          <div className="absolute right-10 bottom-4">
          <Image
              src={avatarImg}
              width={50}
              height={50}
              alt="Illustration"
              className="rounded-full"
            />
          </div>
        </CardHeader>
        <CardContent className={`rounded-t-3xl p-6 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>«{word.word}»</h3>
            <Button variant="ghost" size="icon" className={darkMode ? 'text-green-400' : 'text-[#2c6e49]'} onClick={() => pronounceWord(word.word)} // Add this line to handle pronunciation
            >
              <span className="sr-only">Pronounce</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </Button>
          </div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-500'}>[{word.pronunciation}]</p>
          <div>
            <span className="text-[#ffa41b] font-semibold">• {word.wordType}</span>
            <p className={`mt-2 ${darkMode ? 'text-white' : 'text-black'}`}>
              {word.meaning}
            </p>
            <ul className={`list-disc pl-5 mt-2 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-500'} italic`}>
              <li>{word.example}</li>
              {/* <li>The museum's collection of personalia offers intimate glimpses into the artist's life.</li> */}
            </ul>
          </div>
          <Tabs defaultValue="synonyms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="synonyms">Synonyms</TabsTrigger>
              <TabsTrigger value="antonyms">Antonyms</TabsTrigger>
            </TabsList>
            <TabsContent value="synonyms" className="mt-2">
              <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {word.synonyms ? word.synonyms?.map(synonym => (
                  <li key={synonym}>{synonym.charAt(0).toUpperCase() + synonym.slice(1).toLowerCase()}</li>
                )) : "Null"}
              </ul>
            </TabsContent>
            <TabsContent value="antonyms" className="mt-2">
              <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {word.antonyms ? word.antonyms?.map(antonym => (
                  <li key={antonym}>{antonym.charAt(0).toUpperCase() + antonym.slice(1).toLowerCase()}</li>
                )) : "Null"}
              </ul>
            </TabsContent>
          </Tabs>
          <Card className={darkMode ? 'bg-gray-600 border-none' : 'bg-[#faf7e8] border-none'}>
            <CardHeader>
              <CardTitle className={`text-xl font-serif ${darkMode ? 'text-white' : 'text-black'}`}>What is the Origin?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {word.origin}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}