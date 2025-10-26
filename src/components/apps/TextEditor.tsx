import { useState, useEffect } from "react";
import { Save, FileText, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { useFileSystem } from "@/contexts/FileSystemContext";

interface TextEditorProps {
  fileId?: string;
}

export const TextEditor = ({ fileId }: TextEditorProps) => {
  const { createFile, updateFile, getFile, downloadFile } = useFileSystem();
  const [content, setContent] = useState("Welcome to NEO Text Editor!\n\nStart typing here...");
  const [fileName, setFileName] = useState("Untitled");
  const [fileExtension, setFileExtension] = useState(".txt");
  const [currentFileId, setCurrentFileId] = useState<string | undefined>(fileId);

  useEffect(() => {
    if (fileId) {
      const file = getFile(fileId);
      if (file) {
        setContent(file.content);
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        setFileName(nameWithoutExt);
        setFileExtension(file.extension);
        setCurrentFileId(fileId);
      }
    }
  }, [fileId, getFile]);

  const handleSave = () => {
    if (currentFileId) {
      updateFile(currentFileId, content);
      toast.success(`${fileName}${fileExtension} updated!`);
    } else {
      createFile(fileName, content, "Home", fileExtension);
      toast.success(`${fileName}${fileExtension} saved!`);
    }
  };

  const handleDownload = () => {
    if (currentFileId) {
      downloadFile(currentFileId);
      toast.success("File downloaded!");
    } else {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("File downloaded!");
    }
  };

  const handleNew = () => {
    setContent("");
    setFileName("Untitled");
    setFileExtension(".txt");
    setCurrentFileId(undefined);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="h-14 border-b border-border/50 flex items-center px-4 gap-3 bg-muted/10">
        <Input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-48 h-9 transition-all duration-200"
          placeholder="File name"
        />
        <Select value={fileExtension} onValueChange={setFileExtension}>
          <SelectTrigger className="w-28 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=".txt">.txt</SelectItem>
            <SelectItem value=".md">.md</SelectItem>
            <SelectItem value=".js">.js</SelectItem>
            <SelectItem value=".json">.json</SelectItem>
            <SelectItem value=".html">.html</SelectItem>
            <SelectItem value=".css">.css</SelectItem>
            <SelectItem value=".log">.log</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={handleSave} className="transition-all duration-150 hover:scale-105">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDownload} className="transition-all duration-150 hover:scale-105">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="ghost" size="sm" onClick={handleNew} className="transition-all duration-150 hover:scale-105">
          <FileText className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full resize-none font-mono text-sm bg-transparent border-none focus-visible:ring-0 transition-all duration-200"
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
};
