import React from 'react';
import { STRINGS_CONFIG, VIOLIN_NOTES } from '../constants';
import { NoteData } from '../types';

interface ViolinProps {
  onNoteInteract: (note: NoteData) => void;
  activeNoteId?: string;
  showHints?: boolean;
}

const Violin: React.FC<ViolinProps> = ({ onNoteInteract, activeNoteId, showHints }) => {
  
  const getNoteAtPosition = (stringIdx: number, fingerIdx: number) => {
    return VIOLIN_NOTES.find(n => n.stringIndex === stringIdx && n.fingerIndex === fingerIdx);
  };

  const handleInteraction = (stringIdx: number, fingerIdx: number) => {
    const note = getNoteAtPosition(stringIdx, fingerIdx);
    if (note) {
      onNoteInteract(note);
    }
  };

  const getStringNumber = (idx: number) => 4 - idx;

  // Visual Positioning Logic (Percentages from top of fingerboard)
  // Based on standard 1st position Major pattern (Tone, Tone, Semitone, Tone)
  // but stylized for clarity.
  const FINGER_POSITIONS = {
      0: 2,   // Open string zone (near nut)
      1: 22,  // 1st Finger
      2: 38,  // 2nd Finger
      3: 46,  // 3rd Finger (Close to 2nd - Semitone)
      4: 65   // 4th Finger (Distinct spacing)
  };

  return (
    <div className="relative w-full max-w-[340px] mx-auto select-none mt-6 mb-4">
      {/* Violin Body Illustration */}
      <div className="w-full h-[520px] bg-[#5e2f0d] rounded-t-[40px] rounded-b-[20px] relative shadow-2xl overflow-hidden border-4 border-[#3e1f08]">
        
        {/* Wood Texture Overlay */}
        <div className="absolute inset-0 wood-texture opacity-90"></div>
        
        {/* Nut (Top Bar) */}
        <div className="absolute top-0 w-full h-12 bg-[#1a1a1a] z-20 flex items-center justify-around px-4 border-b-4 border-[#333] shadow-lg">
             {STRINGS_CONFIG.map((str) => (
                 <div key={str.index} className="w-8 flex justify-center">
                     <span className="text-white font-black text-lg bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-inner border border-gray-500">
                         {getStringNumber(str.index)}
                     </span>
                 </div>
             ))}
        </div>

        {/* Fingerboard (Black/Ebony) */}
        <div className="absolute top-12 left-6 right-6 bottom-6 bg-[#0f0f0f] rounded-b-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border-x border-gray-800">
             
             {/* Strings Container */}
             <div className="relative h-full w-full flex justify-around px-2">
                {STRINGS_CONFIG.map((str) => (
                    <div key={str.index} className="relative h-full w-12 flex justify-center z-10">
                         
                         {/* The String */}
                         {/* Strings get slightly thicker from E to G */}
                        <div 
                          className={`absolute top-0 bottom-0 ${str.color === 'bg-red-500' ? 'bg-[#c0c0c0]' : 'bg-[#e0e0e0]'} shadow-[1px_0_2px_rgba(0,0,0,0.5)] z-10 transition-all duration-100`}
                          style={{ 
                              width: str.index === 0 ? '4px' : str.index === 1 ? '3px' : str.index === 2 ? '2px' : '1px',
                              background: str.index === 0 ? 'linear-gradient(90deg, #b87333, #d4af37)' : 'linear-gradient(90deg, #d1d5db, #f3f4f6)'
                          }}
                        ></div>

                        {/* --- CLICK ZONES & MARKERS --- */}

                        {/* Open String (0) */}
                        <div 
                            className="absolute w-full h-16 top-0 cursor-pointer z-30 group"
                            onClick={() => handleInteraction(str.index, 0)}
                        >
                            <div className={`absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 ${activeNoteId === `s${str.index}-f0` && showHints ? 'border-green-400 bg-green-400/30 scale-110' : 'border-white/10 group-hover:border-white/30'} transition-all`}></div>
                        </div>

                        {/* Finger 1 */}
                        <FingerSticker 
                            top={FINGER_POSITIONS[1]} 
                            onClick={() => handleInteraction(str.index, 1)}
                            active={activeNoteId === `s${str.index}-f1` && showHints === true}
                            label="1"
                            color="bg-yellow-400"
                        />

                        {/* Finger 2 */}
                        <FingerSticker 
                            top={FINGER_POSITIONS[2]} 
                            onClick={() => handleInteraction(str.index, 2)}
                            active={activeNoteId === `s${str.index}-f2` && showHints === true}
                            label="2"
                            color="bg-yellow-400"
                        />

                        {/* Finger 3 */}
                        <FingerSticker 
                            top={FINGER_POSITIONS[3]} 
                            onClick={() => handleInteraction(str.index, 3)}
                            active={activeNoteId === `s${str.index}-f3` && showHints === true}
                            label="3"
                            color="bg-yellow-400"
                        />

                        {/* Finger 4 - Distinct Color & Size */}
                        <FingerSticker 
                            top={FINGER_POSITIONS[4]} 
                            onClick={() => handleInteraction(str.index, 4)}
                            active={activeNoteId === `s${str.index}-f4` && showHints === true}
                            label="4"
                            color="bg-rose-400" 
                            isPinky={true}
                        />

                    </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

interface StickerProps {
    top: number;
    onClick: () => void;
    active: boolean;
    label: string;
    color: string;
    isPinky?: boolean;
}

const FingerSticker: React.FC<StickerProps> = ({ top, onClick, active, label, color, isPinky }) => {
    return (
        <div 
            className="absolute w-full h-12 -ml-0 z-30 cursor-pointer flex items-center justify-center group"
            style={{ top: `${top}%` }}
            onClick={onClick}
        >
            {/* The Sticker Visual */}
            <div 
                className={`
                    relative flex items-center justify-center rounded-full shadow-md transition-all duration-300
                    ${isPinky ? 'w-9 h-9' : 'w-7 h-7'}
                    ${active ? 'scale-125 ring-4 ring-white animate-bounce' : 'scale-100 group-hover:scale-110 opacity-80 group-hover:opacity-100'}
                    ${color}
                `}
            >
                {/* Sticker Gloss */}
                <div className="absolute top-1 left-2 w-2 h-1 bg-white/40 rounded-full blur-[1px]"></div>
                
                {/* Label (Number) - Kept for educational value per app logic, but subtle */}
                <span className={`font-black text-black/70 ${isPinky ? 'text-lg' : 'text-sm'}`}>
                    {label}
                </span>
            </div>
            
            {/* Horizontal Guide Line (Tape) - Subtle */}
            <div className="absolute w-16 h-[2px] bg-white/10 -z-10 rounded-full"></div>
        </div>
    );
};

export default Violin;