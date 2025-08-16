import React from 'react';

const CricketGroundPreview = () => {
  return (
    <div 
      className="w-full h-full min-h-screen relative overflow-hidden" 
      style={{
        margin: 0, 
        padding: 0,
        boxSizing: 'border-box',
        display: 'block',
        lineHeight: 0
      }}
    >
      {/* Full Screen Rectangular Ground with Striped Pattern */}
      <div className="absolute inset-0">
        {/* Base green background */}
        <div className="absolute inset-0 bg-green-600"></div>
        
        {/* Vertical grass stripes */}
        <div 
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              #16a34a 0px,
              #16a34a 40px,
              #15803d 40px,
              #15803d 80px
            )`
          }}
        ></div>
        
        {/* Ground Area - Full Screen */}
        <div className="absolute inset-0">
          <div className="w-full h-full relative">
            {/* Pitch */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-10 h-36 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-100 rounded shadow-lg">
              </div>
            </div>
            
            {/* Boundary rope indication - More visible */}
            <div className="absolute inset-8 border-2 border-white border-opacity-30 rounded-full"></div>
            
            {/* MYSERIES11 Text with Embedded Grass Effect - Top */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
              <div className="text-3xl font-black tracking-wider" style={{
                color: 'rgba(255, 255, 255, 0.25)',
                textShadow: `
                  0 1px 0 rgba(255,255,255,0.3),
                  0 -1px 0 rgba(0,0,0,0.4),
                  0 2px 4px rgba(0,0,0,0.3),
                  inset 0 1px 0 rgba(255,255,255,0.2),
                  inset 0 -1px 0 rgba(0,0,0,0.2)
                `,
                WebkitTextStroke: '1px rgba(34, 197, 94, 0.3)',
                letterSpacing: '4px',
                fontWeight: '900'
              }}>
                MYSERIES11
              </div>
            </div>
            

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CricketGroundPreview;