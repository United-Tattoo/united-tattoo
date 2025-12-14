import React from 'react';
import Curtain from './components/ui/Curtain';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Values from './components/Values';
import Care from './components/Care';
import Contact from './components/Contact';

function App() {
  return (
    <main className="antialiased selection:bg-stone-300 selection:text-black">
      <Curtain />
      <Navigation />
      <Hero />
      <About />
      <Portfolio />
      <Values />
      <Care />
      <Contact />
    </main>
  );
}

export default App;