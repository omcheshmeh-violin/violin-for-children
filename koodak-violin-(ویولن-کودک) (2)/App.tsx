import React, { useState, useEffect } from 'react';
import { Play, Star, Award, RotateCcw, Volume2, Home, CheckCircle2, XCircle } from 'lucide-react';
import Violin from './components/Violin';
import Staff from './components/Staff';
import { VIOLIN_NOTES, LEVELS } from './constants';
import { NoteData, GameState, LevelConfig } from './types';
import { audioService } from './services/audioService';

const QUESTIONS_PER_LEVEL = 10;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(LEVELS[0]);
  
  // Game Logic States
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  
  const [targetNote, setTargetNote] = useState<NoteData | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' | '' }>({ msg: '', type: '' });
  const [showHints, setShowHints] = useState(false);

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    audioService.init();
  };

  const startGame = (levelId: number) => {
    initAudio();
    const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    setCurrentLevel(level);
    
    // Reset Stats
    setQuestionCount(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setGameState(GameState.PLAYING);
    
    startNextQuestion(level);
  };

  const startNextQuestion = (level: LevelConfig) => {
    // Filter notes based on level constraints
    const possibleNotes = VIOLIN_NOTES.filter(n => 
        level.allowedStrings.includes(n.stringIndex) && 
        n.fingerIndex <= level.maxFinger
    );
    
    let next = possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
    // Try to avoid repeat
    if (possibleNotes.length > 1 && targetNote && next.id === targetNote.id) {
         next = possibleNotes.filter(n => n.id !== targetNote.id)[Math.floor(Math.random() * (possibleNotes.length - 1))];
    }

    setTargetNote(next);
    setFeedback({ msg: '', type: '' });
    setShowHints(false);
    setHasAnsweredCurrent(false);
  };

  const handleNoteInteraction = (playedNote: NoteData) => {
    initAudio();
    audioService.playTone(playedNote.frequency);

    if (gameState !== GameState.PLAYING || !targetNote) return;
    
    // Block multiple answers during transition
    if (feedback.type === 'success') return;

    if (playedNote.id === targetNote.id) {
      // Correct!
      audioService.playSuccess();
      setFeedback({ msg: 'آفرین! درسته! 🌟', type: 'success' });
      
      if (!hasAnsweredCurrent) {
        setCorrectCount(c => c + 1);
      }

      setQuestionCount(c => c + 1);

      // Check if level is done
      if (questionCount >= QUESTIONS_PER_LEVEL - 1) {
          setTimeout(() => {
              setGameState(GameState.SUMMARY);
          }, 1000);
      } else {
          // Next question
          setTimeout(() => {
              startNextQuestion(currentLevel);
          }, 1500);
      }

    } else {
      // Incorrect
      audioService.playError();
      setFeedback({ msg: 'اشتباه شد، دوباره!', type: 'error' });
      setShowHints(true); // Show hint
      
      if (!hasAnsweredCurrent) {
          setIncorrectCount(c => c + 1);
          setHasAnsweredCurrent(true); // Mark as failed attempt for this question
      }
    }
  };

  // Render Functions
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 animate-float">
      <h1 className="text-5xl font-black text-amber-800 mb-4 drop-shadow-md text-center">🎻 ویولن من</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        یادگیری نت‌های موسیقی با بازی و سرگرمی! سطح خودت را انتخاب کن:
      </p>
      
      <div className="grid gap-4 w-full max-w-md pb-10">
        {LEVELS.map(level => (
            <button
                key={level.id}
                onClick={() => startGame(level.id)}
                className="flex items-center p-4 bg-white rounded-2xl shadow-lg border-b-4 border-amber-700 hover:translate-y-1 hover:border-b-0 transition-all group"
            >
                <div className="bg-amber-100 p-3 rounded-full ml-4 group-hover:bg-amber-200 transition-colors">
                    {level.id === 7 ? <Award className="w-6 h-6 text-amber-700"/> : <Star className="w-6 h-6 text-amber-600" fill={level.id <= 2 ? "currentColor" : "none"}/>}
                </div>
                <div className="text-right flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{level.title}</h3>
                    <p className="text-sm text-gray-500">{level.description}</p>
                </div>
                <Play className="w-6 h-6 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        ))}
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-sky-50 overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white shadow-sm z-10">
            <button onClick={() => setGameState(GameState.MENU)} className="p-2 hover:bg-gray-100 rounded-full">
                <Home className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2 space-x-reverse bg-amber-100 px-4 py-1 rounded-full border border-amber-300">
                <span className="font-bold text-amber-800 text-sm">سوال {questionCount + 1} از {QUESTIONS_PER_LEVEL}</span>
            </div>
             <button onClick={() => startNextQuestion(currentLevel)} className="p-2 hover:bg-gray-100 rounded-full">
                <RotateCcw className="w-6 h-6 text-gray-600" />
            </button>
        </div>

        {/* Game Area */}
        <div className="flex-1 overflow-y-auto p-4 pb-20">
            {/* Target Display */}
            <div className="mb-4">
                 <div className="text-center mb-2">
                    <span className="text-gray-500 text-sm">نت مورد نظر را پیدا کن:</span>
                 </div>
                 <Staff 
                    note={targetNote} 
                    highlight={feedback.type === 'success'}
                    className="border-4 border-sky-200"
                 />
                 
                 {/* Target Name (Big) */}
                 {targetNote && (
                     <div className="text-center mt-2 flex justify-center items-center gap-2">
                        <span className="text-4xl font-black text-sky-700">{targetNote.nameFa}</span>
                        <button onClick={() => audioService.playTone(targetNote.frequency)} className="p-2 bg-white rounded-full shadow hover:bg-sky-50">
                            <Volume2 className="w-5 h-5 text-sky-500" />
                        </button>
                     </div>
                 )}
            </div>

            {/* Feedback Overlay */}
            <div className={`text-center h-12 flex items-center justify-center transition-all ${feedback.type === 'success' ? 'scale-110' : ''}`}>
                 {feedback.msg && (
                     <span className={`px-6 py-2 rounded-full text-white font-bold text-lg shadow-md animate-pop ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-400'}`}>
                         {feedback.msg}
                     </span>
                 )}
            </div>

            {/* Violin Interaction */}
            <Violin 
                onNoteInteract={handleNoteInteraction} 
                activeNoteId={targetNote?.id}
                showHints={showHints}
            />
        </div>
    </div>
  );

  const renderSummary = () => (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-amber-50 animate-pop">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border-4 border-amber-200">
              <Award className="w-20 h-20 mx-auto text-amber-500 mb-4" />
              <h2 className="text-3xl font-black text-gray-800 mb-2">پایان مرحله!</h2>
              <p className="text-gray-500 mb-6">{currentLevel.title}</p>
              
              <div className="flex justify-around mb-8">
                  <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <span className="font-bold text-2xl text-green-700">{correctCount}</span>
                      <span className="text-xs text-gray-500">درست</span>
                  </div>
                   <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                          <XCircle className="w-8 h-8 text-red-600" />
                      </div>
                      <span className="font-bold text-2xl text-red-700">{incorrectCount}</span>
                      <span className="text-xs text-gray-500">غلط</span>
                  </div>
              </div>

              <div className="space-y-3">
                  <button 
                    onClick={() => startGame(currentLevel.id)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                      <RotateCcw className="w-5 h-5" />
                      دوباره بازی کن
                  </button>
                  <button 
                    onClick={() => setGameState(GameState.MENU)}
                    className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
                  >
                      بازگشت به منو
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-sky-50 text-right">
      {gameState === GameState.MENU && renderMenu()}
      {gameState === GameState.PLAYING && renderGame()}
      {gameState === GameState.SUMMARY && renderSummary()}
    </div>
  );
};

export default App;