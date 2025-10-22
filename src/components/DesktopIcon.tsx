import { useState } from "react";

interface DesktopIconProps {
  name: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
}

export const DesktopIcon = ({ name, icon, onDoubleClick }: DesktopIconProps) => {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(prev => prev + 1);
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
      className="flex flex-col items-center justify-center w-24 h-24 rounded-lg hover:bg-muted/20 transition-colors group cursor-pointer"
    >
      <div className="text-primary mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs text-center text-foreground group-hover:text-primary transition-colors">
        {name}
      </span>
    </button>
  );
};
