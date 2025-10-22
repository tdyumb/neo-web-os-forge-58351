import { useState } from "react";

interface DesktopIconProps {
  name: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
}

export const DesktopIcon = ({ name, icon, onDoubleClick }: DesktopIconProps) => {
  const [clicks, setClicks] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    setTimeout(() => {
      if (clicks === 0) {
        onDoubleClick();
      }
      setClicks(0);
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-24 h-24 rounded-lg hover:bg-muted/30 active:bg-muted/50 transition-all duration-150 group cursor-pointer"
    >
      <div className={`text-primary mb-2 group-hover:scale-110 transition-transform duration-200 ${isAnimating ? 'animate-icon-bounce' : ''}`}>
        {icon}
      </div>
      <span className="text-xs text-center text-foreground group-hover:text-primary transition-colors duration-150">
        {name}
      </span>
    </button>
  );
};
