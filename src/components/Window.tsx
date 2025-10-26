import { useState, useRef, useEffect } from "react";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { WindowData } from "./Desktop";
import { Button } from "./ui/button";

interface WindowProps {
  window: WindowData;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUpdate: (updates: Partial<WindowData>) => void;
}

export const Window = ({ window, isActive, onClose, onMinimize, onMaximize, onFocus, onUpdate }: WindowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    onFocus();
    setIsDragging(true);
    setDragStart({ x: e.clientX - window.position.x, y: e.clientY - window.position.y });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onUpdate({
          position: {
            x: Math.max(0, Math.min(e.clientX - dragStart.x, globalThis.innerWidth - window.size.width)),
            y: Math.max(0, Math.min(e.clientY - dragStart.y, globalThis.innerHeight - 100)),
          },
        });
      } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        onUpdate({
          size: {
            width: Math.max(400, window.size.width + deltaX),
            height: Math.max(300, window.size.height + deltaY),
          },
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, window, onUpdate]);

  const windowStyle = window.isMaximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100vh - 3.5rem)' }
    : {
        top: window.position.y,
        left: window.position.x,
        width: window.size.width,
        height: window.size.height,
      };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col rounded-lg overflow-hidden transition-all duration-200 backdrop-blur-xl animate-fade-in ${
        isActive ? 'shadow-[var(--shadow-window)] z-50' : 'shadow-lg z-40'
      }`}
      style={{
        ...windowStyle,
        background: 'hsl(var(--glass-bg))',
        border: '1px solid hsl(var(--glass-border))',
      }}
      onClick={onFocus}
    >
      {/* Title bar */}
      <div
        className="h-10 px-4 flex items-center justify-between cursor-move bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border/50"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="text-primary">{window.icon}</div>
          <span className="text-sm font-medium text-foreground">{window.title}</span>
        </div>
        <div className="flex items-center gap-1 window-controls">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted/50"
            onClick={onMinimize}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted/50"
            onClick={onMaximize}
          >
            {window.isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive/50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-card/30">
        {window.content}
      </div>

      {/* Resize handle */}
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-primary/50" />
        </div>
      )}
    </div>
  );
};
