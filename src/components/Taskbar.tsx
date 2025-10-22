import { useState } from "react";
import { Menu, Folder, FileText, Calculator, Terminal, Settings as SettingsIcon, Globe, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { WindowData } from "./Desktop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

interface TaskbarProps {
  windows: WindowData[];
  activeWindowId: string | null;
  onWindowClick: (id: string) => void;
  onOpenApp: (name: string, icon: React.ReactNode, content: React.ReactNode) => void;
  pinnedApps: Array<{ name: string; icon: React.ReactNode; content: React.ReactNode }>;
}

export const Taskbar = ({ windows, activeWindowId, onWindowClick, onOpenApp, pinnedApps }: TaskbarProps) => {
  const [time, setTime] = useState(new Date());

  setInterval(() => setTime(new Date()), 1000);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 backdrop-blur-xl bg-card/80 border-t border-border/50 flex items-center px-2 gap-2 z-[100]">
      {/* Start Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg hover:bg-primary/20">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              N
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 mb-2 bg-card/95 backdrop-blur-xl border-border">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NEO Applications
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {pinnedApps.map((app) => (
                <DropdownMenuItem
                  key={app.name}
                  className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted/50 rounded-lg"
                  onClick={() => onOpenApp(app.name, app.icon, app.content)}
                >
                  <div className="text-primary mb-2">{app.icon}</div>
                  <span className="text-xs text-center">{app.name}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => onOpenApp("Settings", <SettingsIcon className="h-4 w-4" />, pinnedApps.find(app => app.name === "Settings")?.content)}
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-8 w-px bg-border/50" />

      {/* Open Windows */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {windows.map((window) => (
          <Button
            key={window.id}
            variant={activeWindowId === window.id ? "secondary" : "ghost"}
            size="sm"
            className={`h-10 px-3 rounded-lg flex items-center gap-2 ${
              activeWindowId === window.id ? 'bg-primary/20 border border-primary/30' : 'hover:bg-muted/50'
            }`}
            onClick={() => onWindowClick(window.id)}
          >
            <div className="text-primary">{window.icon}</div>
            <span className="text-sm max-w-[150px] truncate">{window.title}</span>
          </Button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-lg bg-muted/30 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
