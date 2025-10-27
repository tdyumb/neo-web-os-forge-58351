import { useEffect, useState } from "react";
import { Monitor, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BootScreenProps {
  onComplete: () => void;
  username?: string;
}

export const BootScreen = ({ onComplete, username }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const steps = [
      { progress: 20, status: "Loading system files...", delay: 300 },
      { progress: 40, status: "Mounting file system...", delay: 300 },
      { progress: 60, status: "Loading applications...", delay: 400 },
      { progress: 80, status: "Restoring session...", delay: 300 },
      { progress: 100, status: "Ready!", delay: 200 },
    ];

    let currentStep = 0;
    const runStep = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setProgress(step.progress);
        setStatus(step.status);
        currentStep++;
        setTimeout(runStep, step.delay);
      } else {
        setTimeout(onComplete, 300);
      }
    };

    setTimeout(runStep, 500);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 animate-fade-in">
      <div className="max-w-md w-full mx-4 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full animate-glow">
            <Monitor className="h-16 w-16 text-primary" />
          </div>
          {username && (
            <h2 className="text-xl font-semibold text-foreground">
              Welcome back, {username}
            </h2>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{status}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};
