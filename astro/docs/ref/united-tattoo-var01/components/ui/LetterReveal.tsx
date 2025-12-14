import React from 'react';
import { useIntersectionObserver } from '../../utils/useIntersectionObserver';

interface LetterRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

const LetterReveal: React.FC<LetterRevealProps> = ({ 
  text, 
  className = "", 
  delay = 0,
  stagger = 0.03 
}) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  // Split text into words, then letters to handle wrapping correctly
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap overflow-hidden">
          {word.split("").map((letter, letterIndex) => {
            // Calculate global index for delay
            const globalIndex = words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) + letterIndex;
            
            return (
              <span
                key={letterIndex}
                className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.54,0.12,0.47,0.99)]"
                style={{
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
                  transitionDelay: `${delay + globalIndex * stagger}s`
                }}
              >
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

export default LetterReveal;