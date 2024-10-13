// app/api/words/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Word from '@/models/Word';

// POST request handler to add a new word
export async function POST(request: Request) {
    const data = await request.json();
    
    await connectToDatabase();
    
    if (!data.word || !data.meaning || !data.example || !data.wordType || !data.synonyms || !data.antonyms || !data.pronunciation || !data.origin || !data.date) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    
    try {
        const existingWord = await Word.findOne({ date: data.date });
        if (existingWord) {
            return NextResponse.json({ success: false, message: 'Word for the day already exists', word: existingWord }, { status: 401 });
        }

        const newWord = new Word({
            word: data.word,
            meaning: data.meaning,
            example: data.example,
            wordType: data.wordType,
            synonyms: data.synonyms,
            antonyms: data.antonyms,
            pronunciation: data.pronunciation,
            date: data.date,
            origin: data.origin,
        });

        await newWord.save();
        return NextResponse.json({ success: true, message: 'Word saved successfully', word: newWord }, { status: 201 });
    
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error! Please try again!', error }, { status: 500 });
    }
}

// GET request handler to get the latest word added
export async function GET() {
    try {
        // Connect to MongoDB
        await connectToDatabase();
        
        // Find the latest word by sorting based on the 'date' field in descending order
        const latestWord = await Word.findOne().sort({ date: -1 }); // Sort by date in descending order

        if (!latestWord) {
            return NextResponse.json({ success: false, message: 'No words found' }, { status: 404 });
        }

        // Return the latest word
        return NextResponse.json({ success: true, word: latestWord }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error! Please try again!', error }, { status: 500 });
    }
}