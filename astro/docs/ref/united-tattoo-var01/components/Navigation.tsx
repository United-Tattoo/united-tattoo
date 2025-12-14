import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Values', href: '#values' },
  { name: 'Care', href: '#care' },
  { name: 'Contact', href: '#contact' },
];

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Desktop Nav */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 transition-transform duration-500 ${
          scrolled ? 'bg-[#f5f5f0]/90 backdrop-blur-md shadow-sm translate-y-0' : 'bg-transparent'
        }`}
      >
        <a href="#" className="text-xl font-bold tracking-widest uppercase font-serif z-50 mix-blend-difference text-stone-900">
          United Tattoo
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item, idx) => (
            <a 
              key={item.name} 
              href={item.href}
              className="relative overflow-hidden group text-sm uppercase tracking-widest font-medium"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                {item.name}
              </span>
              <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-stone-500">
                {item.name}
              </span>
            </a>
          ))}
          <a href="#contact" className="ml-4 px-6 py-2 border border-stone-900 rounded-full hover:bg-stone-900 hover:text-white transition-colors duration-300 text-sm uppercase tracking-widest">
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={toggleMenu} className="md:hidden z-50 p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-[#f5f5f0] flex flex-col justify-center items-center gap-8 transition-transform duration-700 ease-[cubic-bezier(0.54,0.12,0.47,0.99)] ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {navItems.map((item, idx) => (
          <a 
            key={item.name} 
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="text-4xl font-serif uppercase tracking-wider hover:italic transition-all"
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {item.name}
          </a>
        ))}
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-stone-500 text-sm uppercase tracking-widest">Fountain, CO</p>
          <a href="mailto:contact@unitedtattoo.com" className="text-lg underline">contact@unitedtattoo.com</a>
        </div>
      </div>
    </>
  );
};

export default Navigation;