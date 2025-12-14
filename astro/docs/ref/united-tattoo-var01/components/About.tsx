import React, { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../utils/useIntersectionObserver';

const About: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Calculate offset relative to the viewport center for smoother parallax
        // This value changes as the user scrolls
        setOffset(rect.top);
      }
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 px-6 md:px-12 bg-white text-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Image Grid */}
        <div className="relative h-[600px] w-full" ref={ref}>
          {/* Image 1: Background - Moves slower (parallax effect) */}
          <div 
            className="absolute top-0 left-0 w-3/4 h-3/4 z-0"
            style={{ transform: `translateY(${offset * 0.05}px)` }} // Moves in same direction as scroll (down visually relative to container moving up) = Slower/Background
          >
            <div 
              className={`w-full h-full overflow-hidden transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-12'}`}
            >
              <img 
                src="https://picsum.photos/600/800?grayscale" 
                alt="Studio Atmosphere" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
          
          {/* Image 2: Foreground - Moves faster or opposite to create depth */}
          <div 
            className="absolute bottom-0 right-0 w-2/3 h-2/3 border-8 border-white z-10 shadow-xl"
            style={{ transform: `translateY(${offset * -0.08}px)` }} // Moves opposite to scroll = Faster/Foreground
          >
            <div 
              className={`w-full h-full overflow-hidden transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-12'}`}
            >
              <img 
                src="https://picsum.photos/500/600?grayscale" 
                alt="Artist working" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center z-20 relative">
          <div 
            className="w-16 h-[2px] bg-stone-900 mb-8 transition-all duration-1000 origin-left"
            style={{ transform: isVisible ? 'scaleX(1)' : 'scaleX(0)' }}
          ></div>
          
          <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
            More Than Just <br/> 
            <span 
              className="italic text-stone-500 inline-block"
              style={{ transform: `translateX(${Math.max(0, (offset - 300) * -0.1)}px)` }} // Slides in from right slightly as you scroll down
            >
              Ink on Skin
            </span>
          </h2>
          
          <div className="space-y-6 text-lg font-light text-stone-600 leading-relaxed">
            <p className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              At United Tattoo, we believe that a tattoo studio should be a sanctuary. 
              Our space in Fountain, Colorado is designed to feel like a living room—warm, inviting, and safe for everyone.
            </p>
            <p className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              We are founded on the principles of <strong>Family</strong>, <strong>Community</strong>, and <strong>Inclusivity</strong>. 
              Whether it's your first tattoo or your fiftieth, you belong here. We take the time to connect with your energy, understanding that the art we create together is a permanent expression of your journey.
            </p>
          </div>
          
          <div className={`mt-12 grid grid-cols-2 gap-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="group">
              <h3 className="font-serif text-xl mb-2 group-hover:text-stone-500 transition-colors">Safe Space</h3>
              <p className="text-sm text-stone-500">We prioritize comfort and consent in every interaction.</p>
            </div>
            <div className="group">
              <h3 className="font-serif text-xl mb-2 group-hover:text-stone-500 transition-colors">Custom Art</h3>
              <p className="text-sm text-stone-500">Unique designs tailored specifically to your body and story.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;