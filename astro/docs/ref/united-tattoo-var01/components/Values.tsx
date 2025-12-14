import React from 'react';
import { useIntersectionObserver } from '../utils/useIntersectionObserver';

const values = [
  {
    title: "Trust",
    desc: "Trust creates the canvas for great art. We build relationships with our clients based on mutual respect and open communication."
  },
  {
    title: "Freedom",
    desc: "Your body, your choice. We provide a judgment-free zone where you can freely express yourself through ink."
  },
  {
    title: "Care",
    desc: "From the initial consultation to the final heal, we guide you through the process with professional care and attention."
  }
];

const Values: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section id="values" className="py-24 px-6 md:px-12 bg-[#f5f5f0]">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-stone-300 pt-12">
          {values.map((val, idx) => (
            <div 
              key={val.title}
              className={`transition-all duration-700 ease-out`}
              style={{ 
                opacity: isVisible ? 1 : 0, 
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${idx * 200}ms`
              }}
            >
              <h3 className="text-3xl font-serif mb-4 lowercase italic">{val.title}</h3>
              <p className="text-stone-600 font-light leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-24 text-center">
          <p className="font-serif text-2xl md:text-4xl text-stone-800 leading-snug">
            "I feel your energy and transfer it to the most expensive canvas in the world – your body."
          </p>
        </div>
      </div>
    </section>
  );
};

export default Values;