import { LevelConfig, NoteData } from './types';

// Violin Strings: G3, D4, A4, E5
export const STRINGS_CONFIG = [
  { name: 'Sol (G)', color: 'bg-red-500', baseFreq: 196.00, index: 0 },
  { name: 'Re (D)', color: 'bg-yellow-500', baseFreq: 293.66, index: 1 },
  { name: 'La (A)', color: 'bg-blue-500', baseFreq: 440.00, index: 2 },
  { name: 'Mi (E)', color: 'bg-green-500', baseFreq: 659.25, index: 3 },
];

// Helper to generate Note Data
const createNote = (
  stringIdx: number,
  fingerIdx: number,
  nameFa: string,
  nameEn: string,
  freq: number,
  offset: number,
  color: string
): NoteData => ({
  id: `s${stringIdx}-f${fingerIdx}`,
  stringIndex: stringIdx,
  fingerIndex: fingerIdx,
  nameFa,
  nameEn,
  frequency: freq,
  staffOffset: offset,
  color,
});

// Full map of 1st Position Notes
// Staff Offset reference: G3=0. Each step is 1 staff position (line/space).
export const VIOLIN_NOTES: NoteData[] = [
  // G String (Red)
  createNote(0, 0, 'سُل', 'G3', 196.00, 0, 'text-red-600'),
  createNote(0, 1, 'لا', 'A3', 220.00, 1, 'text-red-500'),
  createNote(0, 2, 'سی', 'B3', 246.94, 2, 'text-red-500'),
  createNote(0, 3, 'دُ', 'C4', 261.63, 3, 'text-red-500'),
  createNote(0, 4, 'رِ', 'D4', 293.66, 4, 'text-red-500'), 

  // D String (Yellow)
  createNote(1, 0, 'رِ', 'D4', 293.66, 4, 'text-yellow-600'),
  createNote(1, 1, 'می', 'E4', 329.63, 5, 'text-yellow-500'),
  createNote(1, 2, 'فا', 'F#4', 369.99, 6, 'text-yellow-500'),
  createNote(1, 3, 'سُل', 'G4', 392.00, 7, 'text-yellow-500'),
  createNote(1, 4, 'لا', 'A4', 440.00, 8, 'text-yellow-500'),

  // A String (Blue)
  createNote(2, 0, 'لا', 'A4', 440.00, 8, 'text-blue-600'),
  createNote(2, 1, 'سی', 'B4', 493.88, 9, 'text-blue-500'),
  createNote(2, 2, 'دُ', 'C#5', 554.37, 10, 'text-blue-500'),
  createNote(2, 3, 'رِ', 'D5', 587.33, 11, 'text-blue-500'),
  createNote(2, 4, 'می', 'E5', 659.25, 12, 'text-blue-500'),

  // E String (Green)
  createNote(3, 0, 'می', 'E5', 659.25, 12, 'text-green-600'),
  createNote(3, 1, 'فا', 'F#5', 739.99, 13, 'text-green-500'),
  createNote(3, 2, 'سُل', 'G#5', 830.61, 14, 'text-green-500'),
  createNote(3, 3, 'لا', 'A5', 880.00, 15, 'text-green-500'),
  createNote(3, 4, 'سی', 'B5', 987.77, 16, 'text-green-500'),
];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'سیم لا (A)',
    description: 'شروع تمرین با سیم دوم',
    allowedStrings: [2],
    maxFinger: 4, 
  },
  {
    id: 2,
    title: 'سیم ر (D)',
    description: 'تمرین با سیم سوم',
    allowedStrings: [1],
    maxFinger: 4,
  },
  {
    id: 3,
    title: 'سیم لا و ر (A, D)',
    description: 'ترکیب دو سیم میانی',
    allowedStrings: [1, 2],
    maxFinger: 4,
  },
  {
    id: 4,
    title: 'سیم می (E)',
    description: 'سیم اول (نازک‌ترین)',
    allowedStrings: [3],
    maxFinger: 4,
  },
  {
    id: 5,
    title: 'سیم لا، ر و می',
    description: 'سه سیم بالا',
    allowedStrings: [1, 2, 3],
    maxFinger: 4,
  },
  {
    id: 6,
    title: 'سیم سُل (G)',
    description: 'سیم چهارم (بم‌ترین)',
    allowedStrings: [0],
    maxFinger: 4,
  },
  {
    id: 7,
    title: 'تمام سیم‌ها',
    description: 'تمرین کامل روی ۴ سیم',
    allowedStrings: [0, 1, 2, 3],
    maxFinger: 4,
  },
];