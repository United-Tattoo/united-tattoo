import React, { useRef } from 'react';

const works = [
  { id: 1, src: "https://picsum.photos/400/500?random=1", title: "Botanical Flow" },
  { id: 2, src: "https://picsum.photos/400/500?random=2", title: "Fine Line" },
  { id: 3, src: "https://picsum.photos/400/500?random=3", title: "Traditional" },
  { id: 4, src: "https://picsum.photos/400/500?random=4", title: "Abstract" },
  { id: 5, src: "https://picsum.photos/400/500?random=5", title: "Script" },
  { id: 6, src: "https://picsum.photos/400/500?random=6", title: "Portrait" },
];

const Portfolio: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="portfolio" className="py-24 bg-[#1a1a1a] text-[#f5f5f0] overflow-hidden">
      <div className="px-6 md:px-12 mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl md:text-6xl font-serif">Selected Works</h2>
          <p className="mt-4 text-stone-400 max-w-md">
            A curation of pieces that define our style. Every piece is unique, designed for the individual.
          </p>
        </div>
        <div className="hidden md:block text-sm uppercase tracking-widest text-stone-500">
          Scroll &rarr;
        </div>
      </div>

      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-6 md:px-12 pb-12 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {works.map((work) => (
          <div 
            key={work.id} 
            className="relative flex-none w-[80vw] md:w-[25vw] aspect-[3/4] snap-center group cursor-pointer"
          >
            <div className="w-full h-full overflow-hidden bg-stone-800">
              <img 
                src={work.src} 
                alt={work.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className="absolute bottom-6 left-6 z-10">
              <span className="text-3xl font-serif text-white translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 block">
                {work.title}
              </span>
            </div>
          </div>
        ))}
        {/* Spacer */}
        <div className="w-12 flex-none"></div>
      </div>
    </section>
  );
};

export default Portfolio;