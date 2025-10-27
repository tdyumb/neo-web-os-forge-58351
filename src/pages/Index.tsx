import { useState, useEffect } from "react";
import { Desktop } from "@/components/Desktop";
import { SetupScreen } from "@/components/SetupScreen";
import { BootScreen } from "@/components/BootScreen";

const Index = () => {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const [isBooting, setIsBooting] = useState(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const setupData = localStorage.getItem("os-setup-complete");
    const storedUsername = localStorage.getItem("os-username");
    
    if (setupData === "true") {
      setIsSetupComplete(true);
      setUsername(storedUsername || "");
      setIsBooting(true);
    } else {
      setIsSetupComplete(false);
    }
  }, []);

  const handleSetupComplete = (name: string) => {
    localStorage.setItem("os-setup-complete", "true");
    localStorage.setItem("os-username", name);
    setUsername(name);
    setIsSetupComplete(true);
    setIsBooting(true);
  };

  const handleBootComplete = () => {
    setIsBooting(false);
  };

  if (isSetupComplete === null) {
    return null; // Loading state
  }

  if (!isSetupComplete) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (isBooting) {
    return <BootScreen onComplete={handleBootComplete} username={username} />;
  }

  return <Desktop />;
};

export default Index;
