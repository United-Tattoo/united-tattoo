import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="bg-[#1a1a1a] text-stone-300 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">Let's Create Together</h2>
            <p className="text-lg font-light mb-8 max-w-md">
              Ready to start your journey? Fill out the request form or drop by the studio. We are excited to hear your story.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-white uppercase tracking-widest text-sm mb-1">Email</h4>
                <a href="mailto:booking@unitedtattoo.com" className="hover:text-white transition-colors">booking@unitedtattoo.com</a>
              </div>
              <div>
                <h4 className="text-white uppercase tracking-widest text-sm mb-1">Visit</h4>
                <p>123 Main St, Fountain, CO 80817</p>
              </div>
              <div>
                <h4 className="text-white uppercase tracking-widest text-sm mb-1">Social</h4>
                <a href="#" className="hover:text-white transition-colors">@unitedtattoo</a>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/30 p-8 rounded-lg backdrop-blur-sm border border-stone-700">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest mb-2 text-stone-500">Name</label>
                  <input type="text" className="bg-transparent border-b border-stone-600 py-2 focus:border-white outline-none transition-colors" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest mb-2 text-stone-500">Email</label>
                  <input type="email" className="bg-transparent border-b border-stone-600 py-2 focus:border-white outline-none transition-colors" />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest mb-2 text-stone-500">Idea / Concept</label>
                <textarea rows={4} className="bg-transparent border-b border-stone-600 py-2 focus:border-white outline-none transition-colors resize-none"></textarea>
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest mb-2 text-stone-500">Placement</label>
                <input type="text" className="bg-transparent border-b border-stone-600 py-2 focus:border-white outline-none transition-colors" />
              </div>
              <button className="mt-4 px-8 py-3 bg-white text-black uppercase tracking-widest text-sm hover:bg-stone-300 transition-colors w-full md:w-auto">
                Send Request
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-600 uppercase tracking-widest">
          <p>© 2025 United Tattoo. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-stone-400">Privacy Policy</a>
            <a href="#" className="hover:text-stone-400">Terms of Service</a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;