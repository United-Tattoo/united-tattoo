import React, { useEffect, useState } from 'react';

const Curtain: React.FC = () => {
  const [stage, setStage] = useState<'initial' | 'entering' | 'done'>('initial');

  useEffect(() => {
    // Start animation immediately on mount
    requestAnimationFrame(() => {
      setStage('entering');
    });

    const timer = setTimeout(() => {
      setStage('done');
    }, 1400); // 1.2s transition + buffer

    return () => clearTimeout(timer);
  }, []);

  if (stage === 'done') return null;

  return (
    <>
      {/* Light Curtain */}
      <div 
        className={`fixed inset-0 bg-[#f0efee] z-[99999] transition-transform duration-[1200ms] ease-[cubic-bezier(0.54,0.12,0.47,0.99)] ${
          stage === 'entering' ? '-translate-y-full' : 'translate-y-0'
        }`}
      />
      {/* Darker Curtain (Delayed) */}
      <div 
        className={`fixed inset-0 bg-[#c9c7c5] z-[99998] transition-transform duration-[1200ms] delay-100 ease-[cubic-bezier(0.54,0.12,0.47,0.99)] ${
          stage === 'entering' ? '-translate-y-full' : 'translate-y-0'
        }`}
      />
    </>
  );
};

export default Curtain;