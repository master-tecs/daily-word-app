// import mongoose, { Schema, Document } from 'mongoose';
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IWord extends Document {
  word: string;
  meaning: string;
  example: string;
  wordType: string;  // e.g., noun, verb
  synonyms: string[];
  antonyms: string[];
  origin: string;
  pronunciation: string;
  date: Date;
}

const WordSchema: Schema<IWord> = new Schema({
  word: { type: String },
  meaning: { type: String },
  example: { type: String },
  wordType: { type: String },
  synonyms: { type: [String] },
  antonyms: { type: [String] },
  origin: { type: String },
  pronunciation: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

// Create the model from the schema
const Word: Model<IWord> = mongoose.models.word || mongoose.model<IWord>('word', WordSchema);

export default Word;