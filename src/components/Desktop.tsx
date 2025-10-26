import { useState, useEffect } from "react";
import { Taskbar } from "./Taskbar";
import { Window } from "./Window";
import { DesktopIcon } from "./DesktopIcon";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "./ui/context-menu";
import { FileText, Calculator, Terminal, Settings as SettingsIcon, Folder, Globe } from "lucide-react";
import { FileExplorer } from "./apps/FileExplorer";
import { TextEditor } from "./apps/TextEditor";
import { CalculatorApp } from "./apps/CalculatorApp";
import { TerminalApp } from "./apps/TerminalApp";
import { Settings } from "./apps/Settings";
import { Browser } from "./apps/Browser";

export interface WindowData {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  fileId?: string;
}

const STORAGE_KEY = "neo-os-windows";

export const Desktop = () => {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openFileInEditor = (fileId: string) => {
    const existingEditor = windows.find(w => w.title.startsWith("Text Editor"));
    if (existingEditor) {
      setWindows(windows.map(w => 
        w.id === existingEditor.id 
          ? { ...w, content: <TextEditor fileId={fileId} />, fileId, isMinimized: false }
          : w
      ));
      setActiveWindowId(existingEditor.id);
    } else {
      openApp("Text Editor", <FileText className="h-4 w-4" />, <TextEditor fileId={fileId} />, fileId);
    }
  };

  const desktopApps = [
    { name: "Browser", icon: <Globe className="h-8 w-8" />, content: <Browser /> },
    { name: "File Explorer", icon: <Folder className="h-8 w-8" />, content: <FileExplorer onFileOpen={openFileInEditor} /> },
    { name: "Text Editor", icon: <FileText className="h-8 w-8" />, content: <TextEditor /> },
    { name: "Calculator", icon: <Calculator className="h-8 w-8" />, content: <CalculatorApp /> },
    { name: "Terminal", icon: <Terminal className="h-8 w-8" />, content: <TerminalApp /> },
    { name: "Settings", icon: <SettingsIcon className="h-8 w-8" />, content: <Settings /> },
  ];

  // Load windows from localStorage on mount
  useEffect(() => {
    const savedWindows = localStorage.getItem(STORAGE_KEY);
    if (savedWindows) {
      try {
        const parsedWindows = JSON.parse(savedWindows);
        // We need to restore the content from app definitions
        const desktopAppsMap = new Map(desktopApps.map(app => [app.name, app]));
        
        const restoredWindows = parsedWindows.map((w: any) => {
          const app = desktopAppsMap.get(w.title);
          return {
            ...w,
            icon: app?.icon || <Folder className="h-4 w-4" />,
            content: app?.content || <div>App not found</div>,
          };
        });
        
        setWindows(restoredWindows);
        if (parsedWindows.length > 0 && parsedWindows[0].id) {
          setActiveWindowId(parsedWindows[0].id);
        }
      } catch (error) {
        console.error("Failed to load windows from localStorage:", error);
      }
    }
  }, []);

  // Save windows to localStorage whenever they change
  useEffect(() => {
    if (windows.length > 0) {
      const windowsToSave = windows.map(w => ({
        id: w.id,
        title: w.title,
        isMinimized: w.isMinimized,
        isMaximized: w.isMaximized,
        position: w.position,
        size: w.size,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(windowsToSave));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [windows]);

  const openApp = (appName: string, icon: React.ReactNode, content: React.ReactNode, fileId?: string) => {
    const existingWindow = windows.find(w => w.title === appName && !fileId);
    if (existingWindow) {
      setActiveWindowId(existingWindow.id);
      if (existingWindow.isMinimized) {
        setWindows(windows.map(w => 
          w.id === existingWindow.id ? { ...w, isMinimized: false } : w
        ));
      }
      return;
    }

    const newWindow: WindowData = {
      id: `window-${Date.now()}`,
      title: appName,
      icon,
      content,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + windows.length * 30, y: 80 + windows.length * 30 },
      size: { width: 800, height: 600 },
      fileId,
    };
    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(windows.length > 1 ? windows[windows.length - 2].id : null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  };

  const maximizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const updateWindow = (id: string, updates: Partial<WindowData>) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-background to-background/95 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Desktop area */}
      <ContextMenu>
        <ContextMenuTrigger className="h-[calc(100vh-3.5rem)] w-full relative">
          <div className="p-6 grid grid-cols-auto-fill gap-6">
            {desktopApps.map((app) => (
              <DesktopIcon
                key={app.name}
                name={app.name}
                icon={app.icon}
                onDoubleClick={() => openApp(app.name, app.icon, app.content)}
              />
            ))}
          </div>

          {/* Windows */}
          {windows.map((window) => (
            !window.isMinimized && (
              <Window
                key={window.id}
                window={window}
                isActive={activeWindowId === window.id}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onMaximize={() => maximizeWindow(window.id)}
                onFocus={() => setActiveWindowId(window.id)}
                onUpdate={(updates) => updateWindow(window.id, updates)}
              />
            )
          ))}
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-card/95 backdrop-blur-md border-border">
          <ContextMenuItem onClick={() => openApp("Settings", <SettingsIcon className="h-4 w-4" />, <Settings />)}>
            Settings
          </ContextMenuItem>
          <ContextMenuItem onClick={() => window.location.reload()}>
            Refresh Desktop
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={(id) => {
          const window = windows.find(w => w.id === id);
          if (window?.isMinimized) {
            setWindows(windows.map(w => 
              w.id === id ? { ...w, isMinimized: false } : w
            ));
          }
          setActiveWindowId(id);
        }}
        onOpenApp={openApp}
        pinnedApps={desktopApps}
      />
    </div>
  );
};
