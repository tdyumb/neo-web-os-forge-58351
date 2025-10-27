import { useEffect, useState } from "react";
import { Loader2, Hammer } from "lucide-react";

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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center z-50">
      {/* Forge logo - Hammer */}
      <div className="mb-16 relative">
        <div className="absolute inset-0 bg-orange-500/20 blur-3xl animate-pulse" />
        <Hammer className="w-32 h-32 text-orange-500 relative animate-float" strokeWidth={1.5} />
      </div>

      {/* Loading spinner */}
      <div className="flex flex-col items-center space-y-8">
        <Loader2 className="h-10 w-10 text-orange-400 animate-spin" />
        <p className="text-white/90 text-lg font-light tracking-wide">
          Forging your workspace{dots}
        </p>
      </div>
    </div>
  );
};
