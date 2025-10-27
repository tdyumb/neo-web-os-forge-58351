import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor } from "lucide-react";

interface SetupScreenProps {
  onComplete: (username: string) => void;
}

export const SetupScreen = ({ onComplete }: SetupScreenProps) => {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && username.trim()) {
      onComplete(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center z-50 animate-fade-in">
      <div className="max-w-md w-full mx-4 bg-card/80 backdrop-blur-xl border border-border rounded-lg p-8 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-center mb-8">
          <div className="p-4 bg-primary/10 rounded-full">
            <Monitor className="h-12 w-12 text-primary" />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
              <p className="text-muted-foreground">Let's set up your workspace</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm text-foreground">
                  This OS will store your files, settings, and preferences locally in your browser.
                </p>
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">
                Get Started
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Create Your Profile</h1>
              <p className="text-muted-foreground">What should we call you?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleNext()}
                  autoFocus
                />
              </div>
              <Button
                onClick={handleNext}
                className="w-full"
                size="lg"
                disabled={!username.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
