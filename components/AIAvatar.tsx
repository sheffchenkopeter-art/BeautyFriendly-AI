
import React from 'react';

interface AIAvatarProps {
  className?: string;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-primary border border-accent/50 shadow-sm overflow-hidden ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-2/3 h-2/3 text-accent"
      >
        {/* Abstract Hair / Face Flow */}
        <path 
          d="M50 20C35 20 25 32 25 45C25 58 32 65 38 75C40 78 42 85 42 85H58C58 85 60 78 62 75C68 65 75 58 75 45C75 32 65 20 50 20Z" 
          stroke="currentColor" 
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Face Profile Line */}
        <path 
          d="M50 20V45L45 50" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          className="opacity-60"
        />
        {/* AI Sparkle (Mind/Eye) */}
        <path 
          d="M60 38L62 35L64 38L67 40L64 42L62 45L60 42L57 40L60 38Z" 
          fill="currentColor"
        />
        {/* Secondary Sparkle */}
        <path 
          d="M35 55L36 53L37 55L39 56L37 57L36 59L35 57L33 56L35 55Z" 
          fill="currentColor"
          className="opacity-70"
        />
      </svg>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-accent/10 blur-md rounded-full pointer-events-none"></div>
    </div>
  );
};