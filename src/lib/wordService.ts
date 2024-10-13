// import Word from '@/models/word';
import Word from '@/models/Word';
import connectToDatabase from './mongodb';

export async function getWordOfTheDay() {
  await connectToDatabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const word = await Word.findOne({ date: today });
  return word || null;
}

export async function saveWordOfTheDay(wordData: {
  word: string;
  wordType: string;
  meaning: string;
  synonyms?: string[];
  antonyms?: string[];
  origin: string;
}) {
  await connectToDatabase();

  const newWord = new Word(wordData);
  await newWord.save();
  return newWord;
}