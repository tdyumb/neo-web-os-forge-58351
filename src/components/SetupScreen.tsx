import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Hammer } from "lucide-react";

interface SetupScreenProps {
  onComplete: (username: string) => void;
}

export const SetupScreen = ({ onComplete }: SetupScreenProps) => {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && username.trim()) {
      onComplete(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="max-w-xl w-full mx-4">
        {step === 1 && (
          <div className="space-y-12 animate-fade-in text-center">
            <div className="space-y-4">
              <div className="flex justify-center mb-8 relative">
                <div className="absolute inset-0 bg-orange-500/20 blur-3xl animate-pulse" />
                <Hammer className="w-24 h-24 text-orange-500 relative" strokeWidth={1.5} />
              </div>
              <h1 className="text-4xl font-light text-white">Welcome to Forge</h1>
              <p className="text-lg text-slate-300">Let's craft your digital workspace</p>
            </div>
            <Button 
              onClick={handleNext} 
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 shadow-lg shadow-orange-500/30"
            >
              Begin <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-fade-in text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-light text-white">Forge your experience</h1>
              <p className="text-slate-300">Choose what you'll be creating</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {[
                { icon: "🔨", label: "Development" },
                { icon: "⚙️", label: "Engineering" },
                { icon: "🎨", label: "Design" },
                { icon: "📊", label: "Analytics" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 border-slate-700 bg-slate-800/50 hover:border-orange-500 hover:bg-slate-800"
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-sm text-white">{item.label}</div>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleNext}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 shadow-lg shadow-orange-500/30"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12 animate-fade-in text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-light text-white">What's your name?</h1>
              <p className="text-slate-300">Personalize your Forge workspace</p>
            </div>
            <div className="max-w-sm mx-auto space-y-6">
              <div className="relative">
                <Input
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && username.trim() && handleNext()}
                  className="text-center text-lg h-14 bg-slate-800/50 border-slate-700 border-2 rounded-lg text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:border-orange-500"
                  autoFocus
                />
              </div>
              <Button
                onClick={handleNext}
                size="lg"
                disabled={!username.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 disabled:opacity-50 shadow-lg shadow-orange-500/30"
              >
                Start Forging <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
