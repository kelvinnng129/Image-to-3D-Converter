import { Github } from 'lucide-react';

export default function Header({ onReset }) {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onReset} 
          className="flex items-center gap-2 font-bold text-gray-900 hover:opacity-70 transition-opacity"
        >
          <img 
            src="/dist/favicon.svg" 
            alt="Logo" 
            className="w-6 h-6"
          />
          <span>Image to 3D</span>
        </button>
        
        <nav className="flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-black transition-colors">How it works</a>
          <a href="#" className="hover:text-black transition-colors">API</a>
          <a 
            href="https://github.com/kelvinng129" 
            target="_blank" 
            rel="noreferrer" 
            className="text-gray-400 hover:text-black transition-colors"
          >
            <Github size={20} />
          </a>
        </nav>
      </div>
    </header>
  );
}