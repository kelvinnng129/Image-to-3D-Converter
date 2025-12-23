export function GridBackground() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.15] pointer-events-none" 
      style={{ 
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }} 
    />
  );
}

export function WireframeCube() {
  return (
    <div className="w-24 h-24 relative preserve-3d animate-spin-slow">
      <style>{`
        .preserve-3d { 
          transform-style: preserve-3d; 
          transform: rotateX(-20deg) rotateY(45deg); 
        }
        .face { 
          position: absolute; 
          width: 100%; 
          height: 100%; 
          border: 1px solid rgba(0,0,0,0.8); 
          background: rgba(255,255,255,0.1); 
        }
        .front  { transform: rotateY(0deg) translateZ(48px); }
        .back   { transform: rotateY(180deg) translateZ(48px); }
        .right  { transform: rotateY(90deg) translateZ(48px); }
        .left   { transform: rotateY(-90deg) translateZ(48px); }
        .top    { transform: rotateX(90deg) translateZ(48px); }
        .bottom { transform: rotateX(-90deg) translateZ(48px); }
        @keyframes spin { 
          from { transform: rotateX(-20deg) rotateY(0deg); } 
          to { transform: rotateX(-20deg) rotateY(360deg); } 
        }
        .animate-spin-slow { animation: spin 10s infinite linear; }
      `}</style>
      <div className="face front"></div>
      <div className="face back"></div>
      <div className="face right"></div>
      <div className="face left"></div>
      <div className="face top"></div>
      <div className="face bottom"></div>
    </div>
  );
}

export default GridBackground;
