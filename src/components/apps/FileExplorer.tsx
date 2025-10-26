import { useState } from "react";
import { Folder, File, ChevronRight, Home, Download, Image, Music, Video } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useFileSystem } from "@/contexts/FileSystemContext";

interface FileItem {
  id?: string;
  name: string;
  type: "folder" | "file";
  size?: string;
  modified?: string;
}

interface FileExplorerProps {
  onFileOpen?: (fileId: string) => void;
}

export const FileExplorer = ({ onFileOpen }: FileExplorerProps) => {
  const { files: savedFiles } = useFileSystem();
  const [currentPath, setCurrentPath] = useState("Home");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const folders: FileItem[] = [
    { name: "Documents", type: "folder" },
    { name: "Downloads", type: "folder" },
    { name: "Pictures", type: "folder" },
    { name: "Music", type: "folder" },
    { name: "Videos", type: "folder" },
  ];

  const userFiles: FileItem[] = savedFiles
    .filter((f) => f.folder === currentPath)
    .map((f) => ({
      id: f.id,
      name: f.name,
      type: "file" as const,
      size: formatFileSize(f.size),
      modified: f.modified,
    }));

  const files = [...folders, ...userFiles];

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-48 border-r border-border/50 p-2">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setCurrentPath("Home")}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Downloads
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Image className="h-4 w-4 mr-2" />
            Pictures
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Music className="h-4 w-4 mr-2" />
            Music
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navigation bar */}
        <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2">
          <Button variant="ghost" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{currentPath}</span>
        </div>

        {/* File list */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border/30">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Size</th>
                  <th className="pb-2 font-medium">Modified</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr
                    key={file.id || index}
                    className="hover:bg-muted/30 cursor-pointer border-b border-border/10"
                    onDoubleClick={() => {
                      if (file.type === "file" && file.id && onFileOpen) {
                        onFileOpen(file.id);
                      }
                    }}
                  >
                    <td className="py-2 flex items-center gap-2">
                      {file.type === "folder" ? (
                        <Folder className="h-4 w-4 text-primary" />
                      ) : (
                        <File className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{file.name}</span>
                    </td>
                    <td className="py-2 text-sm text-muted-foreground">{file.size || "-"}</td>
                    <td className="py-2 text-sm text-muted-foreground">{file.modified || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
