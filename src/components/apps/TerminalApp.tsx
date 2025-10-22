import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export const TerminalApp = () => {
  const [history, setHistory] = useState<string[]>([
    "NEO Terminal v1.0.0",
    "Type 'help' for available commands",
    "",
  ]);
  const [input, setInput] = useState("");

  const commands: { [key: string]: string } = {
    help: "Available commands: help, clear, about, date, echo",
    clear: "",
    about: "NEO - A modern web-based operating system",
    date: new Date().toString(),
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, `> ${cmd}`];

    if (trimmedCmd === "clear") {
      setHistory([]);
    } else if (trimmedCmd.startsWith("echo ")) {
      newHistory.push(cmd.substring(5));
      setHistory(newHistory);
    } else if (commands[trimmedCmd]) {
      newHistory.push(commands[trimmedCmd]);
      setHistory(newHistory);
    } else if (trimmedCmd) {
      newHistory.push(`Command not found: ${trimmedCmd}`);
      setHistory(newHistory);
    }

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background/50 p-4 font-mono text-sm">
      <ScrollArea className="flex-1 mb-2">
        <div className="space-y-1">
          {history.map((line, index) => (
            <div key={index} className={line.startsWith(">") ? "text-primary" : "text-foreground"}>
              {line}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2">
        <span className="text-primary">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent outline-none text-foreground"
          autoFocus
        />
      </div>
    </div>
  );
};
