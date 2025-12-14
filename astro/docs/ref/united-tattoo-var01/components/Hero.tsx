import React from 'react';
import LetterReveal from './ui/LetterReveal';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden px-4">
      {/* Background Abstract Shapes/Images */}
      <div className="absolute top-1/4 left-10 w-48 h-64 md:w-64 md:h-80 bg-stone-300 opacity-20 rotate-[-10deg] rounded-lg -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-56 h-72 md:w-80 md:h-96 bg-stone-200 opacity-30 rotate-[5deg] rounded-full -z-10"></div>

      <div className="text-center z-10 flex flex-col items-center">
        <div className="mb-4">
           <LetterReveal text="Family • Community • Inclusivity" className="text-sm md:text-base uppercase tracking-[0.2em] text-stone-500" delay={1.2} />
        </div>
        
        <h1 className="text-6xl md:text-9xl font-serif font-semibold tracking-tighter leading-[0.9] text-stone-900 uppercase flex flex-col items-center">
          <LetterReveal text="United" delay={1.4} />
          <LetterReveal text="Tattoo" delay={1.6} />
        </h1>

        <div className="mt-12 max-w-md text-center">
          <p className="text-stone-600 font-light leading-relaxed">
            We translate your story into art. Located in Fountain, Colorado, we are a studio built on the foundation that every body is a canvas and every person is family.
          </p>
        </div>

        <div className="mt-12 relative group">
          <a 
            href="#contact" 
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-stone-900 rounded-full shadow-md group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-stone-900 group-hover:translate-x-0 ease">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-stone-900 transition-all duration-300 transform group-hover:translate-x-full ease">Book Session</span>
            <span className="relative invisible">Book Session</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-stone-900"></div>
      </div>
    </section>
  );
};

export default Hero;