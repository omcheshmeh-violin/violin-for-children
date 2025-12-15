export interface NoteData {
  id: string;
  nameFa: string; // Persian name (e.g., دو, ر)
  nameEn: string; // Scientific name (e.g., C4, D4)
  frequency: number;
  stringIndex: number; // 0=G, 1=D, 2=A, 3=E
  fingerIndex: number; // 0=Open, 1=1st, 2=2nd, 3=3rd, 4=4th
  staffOffset: number; // Position on the staff relative to a baseline
  color: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  description: string;
  allowedStrings: number[]; // Indices of strings used in this level
  maxFinger: number;
}

export enum GameState {
  MENU,
  PLAYING,
  SUMMARY
}

export type FeedbackType = 'neutral' | 'correct' | 'incorrect';