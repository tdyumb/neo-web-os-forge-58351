import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

interface Tab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
}

export const Browser = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: "1", 
      title: "New Tab", 
      url: "https://www.bing.com",
      history: ["https://www.bing.com"],
      historyIndex: 0
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [urlInput, setUrlInput] = useState("https://www.bing.com");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const updateTabHistory = (tabId: string, url: string) => {
    setTabs(tabs.map(tab => {
      if (tab.id === tabId) {
        const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), url];
        return {
          ...tab,
          url,
          title: new URL(url).hostname,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }
      return tab;
    }));
  };

  const handleNavigate = (url?: string) => {
    let targetUrl = url || urlInput.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      // If it doesn't look like a URL, search it
      if (!targetUrl.includes('.') || targetUrl.includes(' ')) {
        targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(targetUrl)}`;
      } else {
        targetUrl = 'https://' + targetUrl;
      }
    }
    
    updateTabHistory(activeTabId, targetUrl);
    setUrlInput(targetUrl);
  };

  const handleBack = () => {
    if (activeTab && activeTab.historyIndex > 0) {
      const newIndex = activeTab.historyIndex - 1;
      const url = activeTab.history[newIndex];
      setTabs(tabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, url, historyIndex: newIndex }
          : tab
      ));
      setUrlInput(url);
    }
  };

  const handleForward = () => {
    if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
      const newIndex = activeTab.historyIndex + 1;
      const url = activeTab.history[newIndex];
      setTabs(tabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, url, historyIndex: newIndex }
          : tab
      ));
      setUrlInput(url);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleHome = () => {
    handleNavigate("https://www.bing.com");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const addNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: "New Tab",
      url: "https://www.bing.com",
      history: ["https://www.bing.com"],
      historyIndex: 0
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setUrlInput(newTab.url);
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(t => t.id !== tabId);
    if (newTabs.length === 0) {
      addNewTab();
      return;
    }
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
      setUrlInput(newTabs[0].url);
    }
  };

  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setUrlInput(tab.url);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background/50">
      {/* Tabs bar */}
      <div className="border-b border-border/50 flex items-center gap-1 px-2 pt-2 bg-muted/20">
        <ScrollArea className="flex-1">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer min-w-[150px] max-w-[200px] ${
                  activeTabId === tab.id 
                    ? 'bg-background border-t border-l border-r border-border/50' 
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
                onClick={() => switchTab(tab.id)}
              >
                <span className="text-xs truncate flex-1">{tab.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 opacity-0 group-hover:opacity-100 hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={addNewTab}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation bar */}
      <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2 bg-muted/10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleBack}
          disabled={!activeTab || activeTab.historyIndex <= 0}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleForward}
          disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleRefresh}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleHome}
        >
          <Home className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm h-6 px-0"
            placeholder="Search or enter address"
          />
        </div>
      </div>

      {/* Browser content */}
      <div className="flex-1 relative">
        {activeTab && (
          <iframe
            ref={iframeRef}
            key={activeTab.id}
            src={activeTab.url}
            className="w-full h-full border-none"
            title={activeTab.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
};
