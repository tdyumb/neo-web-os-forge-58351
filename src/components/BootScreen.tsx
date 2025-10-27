import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface BootScreenProps {
  onComplete: () => void;
  username?: string;
}

export const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const bootTimer = setTimeout(onComplete, 3000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(bootTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0078d4] flex flex-col items-center justify-center z-50">
      {/* Windows logo - 4 squares */}
      <div className="mb-16">
        <div className="grid grid-cols-2 gap-3">
          <div className="w-16 h-16 bg-white/90 rounded-sm" />
          <div className="w-16 h-16 bg-white/90 rounded-sm" />
          <div className="w-16 h-16 bg-white/90 rounded-sm" />
          <div className="w-16 h-16 bg-white/90 rounded-sm" />
        </div>
      </div>

      {/* Loading spinner */}
      <div className="flex flex-col items-center space-y-8">
        <Loader2 className="h-10 w-10 text-white animate-spin" />
        <p className="text-white text-lg font-light">
          Starting up{dots}
        </p>
      </div>
    </div>
  );
};
