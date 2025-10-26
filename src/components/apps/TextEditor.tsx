import { useState, useEffect } from "react";
import { Save, FolderOpen, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useFileSystem } from "@/contexts/FileSystemContext";

interface TextEditorProps {
  fileId?: string;
}

export const TextEditor = ({ fileId }: TextEditorProps) => {
  const { createFile, updateFile, getFile } = useFileSystem();
  const [content, setContent] = useState("Welcome to NEO Text Editor!\n\nStart typing here...");
  const [fileName, setFileName] = useState("Untitled");
  const [currentFileId, setCurrentFileId] = useState<string | undefined>(fileId);

  useEffect(() => {
    if (fileId) {
      const file = getFile(fileId);
      if (file) {
        setContent(file.content);
        setFileName(file.name.replace(".txt", ""));
        setCurrentFileId(fileId);
      }
    }
  }, [fileId, getFile]);

  const handleSave = () => {
    if (currentFileId) {
      updateFile(currentFileId, content);
      toast.success(`${fileName}.txt updated!`);
    } else {
      createFile(fileName, content);
      toast.success(`${fileName}.txt saved!`);
    }
  };

  const handleNew = () => {
    setContent("");
    setFileName("Untitled");
    setCurrentFileId(undefined);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2">
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-48 h-8"
          placeholder="File name"
        />
        <Button variant="ghost" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={handleNew}>
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
