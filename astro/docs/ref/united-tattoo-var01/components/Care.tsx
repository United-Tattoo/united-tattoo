import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    title: "Hydrate",
    desc: "Drink plenty of water and moisturize your skin for 3 days leading up to your appointment. Healthy skin takes ink better."
  },
  {
    title: "Rest & Eat",
    desc: "Get a good night's sleep and eat a hearty meal at least one hour before your session. Bring snacks and sugar!"
  },
  {
    title: "Comfort",
    desc: "Wear loose, comfortable clothing that allows easy access to the placement area. Don't be afraid to bring a hoodie."
  },
  {
    title: "Sobriety",
    desc: "Please do not drink alcohol 24 hours before your appointment. It thins the blood and affects the healing process."
  },
  {
    title: "Sun Safety",
    desc: "Avoid sunburns on the area to be tattooed. We cannot tattoo over damaged or peeling skin."
  }
];

const Care: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => setActiveStep((prev) => (prev + 1) % steps.length);
  const prevStep = () => setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);

  return (
    <section id="care" className="py-24 px-6 md:px-12 bg-white border-t border-stone-200">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
        
        <div className="md:w-1/3">
          <h2 className="text-4xl font-serif mb-6">Before The Session</h2>
          <p className="text-stone-500 mb-8">
            Preparing properly for your tattoo ensures the best possible result and a comfortable experience for both you and the artist.
          </p>
          <div className="flex gap-4">
            <button onClick={prevStep} className="p-3 rounded-full border border-stone-300 hover:bg-stone-900 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextStep} className="p-3 rounded-full border border-stone-300 hover:bg-stone-900 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="md:w-2/3 relative h-64 md:h-auto overflow-hidden bg-stone-50 rounded-2xl p-8 flex items-center justify-center border border-stone-100 shadow-sm">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 p-12 flex flex-col justify-center items-start transition-all duration-500 ease-in-out transform ${
                idx === activeStep 
                  ? 'opacity-100 translate-x-0' 
                  : idx < activeStep 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
              }`}
            >
              <span className="text-9xl absolute right-4 bottom-[-20px] font-serif text-stone-100 -z-10">{idx + 1}</span>
              <h3 className="text-3xl font-serif mb-4 text-stone-800">{step.title}</h3>
              <p className="text-stone-600 text-lg">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Care;