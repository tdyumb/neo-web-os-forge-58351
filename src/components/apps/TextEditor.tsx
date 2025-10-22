import { useState } from "react";
import { Save, FolderOpen, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

export const TextEditor = () => {
  const [content, setContent] = useState("Welcome to NEO Text Editor!\n\nStart typing here...");

  const handleSave = () => {
    toast.success("Document saved successfully!");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2">
        <Button variant="ghost" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="ghost" size="sm">
          <FolderOpen className="h-4 w-4 mr-2" />
          Open
        </Button>
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none font-mono text-sm bg-transparent border-none focus-visible:ring-0"
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
};
