import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";

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
    <div className="fixed inset-0 bg-white dark:bg-[#000000] flex items-center justify-center z-50">
      <div className="max-w-xl w-full mx-4">
        {step === 1 && (
          <div className="space-y-12 animate-fade-in text-center">
            <div className="space-y-4">
              <div className="flex justify-center mb-8">
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-12 h-12 bg-[#0078d4] rounded-sm" />
                  <div className="w-12 h-12 bg-[#0078d4] rounded-sm" />
                  <div className="w-12 h-12 bg-[#0078d4] rounded-sm" />
                  <div className="w-12 h-12 bg-[#0078d4] rounded-sm" />
                </div>
              </div>
              <h1 className="text-4xl font-light text-foreground">Hi there</h1>
              <p className="text-lg text-muted-foreground">Let's get you set up</p>
            </div>
            <Button 
              onClick={handleNext} 
              size="lg"
              className="bg-[#0078d4] hover:bg-[#005a9e] text-white px-8"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-fade-in text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-light text-foreground">Let's personalize your experience</h1>
              <p className="text-muted-foreground">Choose what matters to you</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {[
                { icon: "🎨", label: "Creativity" },
                { icon: "🎮", label: "Gaming" },
                { icon: "📚", label: "Learning" },
                { icon: "💼", label: "Work" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 border-2 border-border rounded-lg hover:border-[#0078d4] cursor-pointer transition-colors"
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-sm text-foreground">{item.label}</div>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleNext}
              size="lg"
              className="bg-[#0078d4] hover:bg-[#005a9e] text-white px-8"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12 animate-fade-in text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-light text-foreground">Who's going to use this PC?</h1>
              <p className="text-muted-foreground">Enter a name to personalize your experience</p>
            </div>
            <div className="max-w-sm mx-auto space-y-6">
              <div className="relative">
                <Input
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && username.trim() && handleNext()}
                  className="text-center text-lg h-14 border-b-2 border-t-0 border-x-0 rounded-none focus-visible:ring-0 focus-visible:border-[#0078d4]"
                  autoFocus
                />
              </div>
              <Button
                onClick={handleNext}
                size="lg"
                disabled={!username.trim()}
                className="bg-[#0078d4] hover:bg-[#005a9e] text-white px-8 disabled:opacity-50"
              >
                Finish <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
