import React from 'react';
import { NoteData } from '../types';

interface StaffProps {
  note: NoteData | null;
  className?: string;
  highlight?: boolean;
}

const Staff: React.FC<StaffProps> = ({ note, className = '', highlight = false }) => {
  const lines = [20, 40, 60, 80, 100]; // 5 lines top to bottom (F5 to E4)
  
  // Reference: G3 (lowest note) is at Y=150.
  // Each step up reduces Y by 10.
  const getNoteY = (n: NoteData): number => {
    return 150 - (n.staffOffset * 10);
  };

  const noteY = note ? getNoteY(note) : 0;
  const showLedgerLineBelow = noteY >= 120; 
  const showLedgerLineAbove = noteY <= 10; 

  // Determine if we should show finger hint (Open or 4th finger)
  // 0 = Open String, 4 = 4th Finger.
  // We explicitly show 0 and 4 to help disambiguate notes like Open A vs D-string-4th-finger.
  const fingerHint = note && (note.fingerIndex === 0 || note.fingerIndex === 4) ? note.fingerIndex : null;

  return (
    <div className={`relative bg-white rounded-xl shadow-lg p-4 w-full h-48 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 180" className="w-full h-full max-w-[300px]">
            {/* Staff Lines */}
            {lines.map((y, i) => (
                <line key={i} x1="10" y1={y} x2="190" y2={y} stroke="#333" strokeWidth="2" />
            ))}

            {/* Improved Treble Clef Path */}
            <path 
                d="M55,125 C45,125 40,115 40,105 C40,90 55,80 60,70 C65,60 65,50 60,45 C55,40 50,45 50,55 L50,140 C50,155 60,160 65,150 C70,140 65,130 55,130 M50,55 L50,20" 
                fill="none" 
                stroke="#000" 
                strokeWidth="3"
                transform="translate(-10, 0)"
            />
            {/* Standard looking Treble Clef using a path approximation or better visual */}
             <path 
              transform="scale(0.25) translate(140, 50)"
              d="M140.7 266.8c12.2-22.1 19.3-46.6 19.3-69.6 0-35.3-15.6-58.4-44.1-66.3V26.5c0-11.4-8.8-17.5-18.7-17.5-9.6 0-17.5 7.5-17.5 17.5v116.6c-18.3 11.2-29.6 30.6-29.6 54.1 0 32.6 22.8 59.8 55.4 69.6v63.8c-23.7 6.4-38.3 16.2-38.3 33.3 0 17.9 19.3 27.6 44.4 27.6 36.3 0 54.4-15.6 54.4-41.2 0-21.2-16.6-33.8-49.8-39.2l-10.7-1.8v-42.5z m-9.6 270.3c21.8 3.5 30.3 10.4 30.3 19.7 0 10-10.9 17-29.4 17-15.3 0-25.3-5-25.3-13.5 0-8.2 8.5-16.8 24.4-23.2zM96.8 200.5c0-14.8 7.4-28.5 21-36.5v72.7c-12.8-5.3-21-19.4-21-36.2z m30.5-83.3c15.6 7.2 22.8 23.4 22.8 44.9 0 18.5-6.1 36.2-15.9 51.5l-6.9-3.2V117.2z"
              fill="#000"
            />

            {/* The Note */}
            {note && (
                <g className={highlight ? "animate-bounce" : ""}>
                     {/* Ledger Lines Below */}
                    {showLedgerLineBelow && noteY >= 120 && (
                        <line x1="85" y1="120" x2="115" y2="120" stroke="#333" strokeWidth="2" />
                    )}
                    {showLedgerLineBelow && noteY >= 140 && (
                        <line x1="85" y1="140" x2="115" y2="140" stroke="#333" strokeWidth="2" />
                    )}

                    {/* Note Head */}
                    <ellipse 
                        cx="100" 
                        cy={noteY} 
                        rx="11" 
                        ry="9" 
                        fill={highlight ? "#10B981" : "#000"} 
                        transform={`rotate(-15 100 ${noteY})`}
                    />
                    {/* Note Stem */}
                    <line 
                        x1={noteY < 80 ? "89" : "110"} 
                        y1={noteY} 
                        x2={noteY < 80 ? "89" : "110"} 
                        y2={noteY < 80 ? noteY + 45 : noteY - 45} 
                        stroke={highlight ? "#10B981" : "#000"} 
                        strokeWidth="2" 
                    />

                    {/* Finger Indication for 0 (Open) or 4 */}
                    {fingerHint !== null && (
                        <g transform={`translate(${noteY < 80 ? 70 : 130}, ${noteY})`}>
                            <circle r="12" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
                            <text x="0" y="4" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">
                                {fingerHint}
                            </text>
                        </g>
                    )}
                </g>
            )}
        </svg>
        
        {/* Helper Text */}
        {note && (
            <div className="absolute top-2 right-4 flex flex-col items-end">
                <span className="text-3xl font-bold text-gray-800">{note.nameFa}</span>
                {note.fingerIndex === 0 && <span className="text-xs text-gray-500 font-bold bg-gray-200 px-2 py-1 rounded mt-1">دست باز</span>}
                {note.fingerIndex === 4 && <span className="text-xs text-amber-700 font-bold bg-amber-100 px-2 py-1 rounded mt-1">انگشت ۴</span>}
            </div>
        )}
    </div>
  );
};

export default Staff;