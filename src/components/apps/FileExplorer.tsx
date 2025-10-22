import { useState } from "react";
import { Folder, File, ChevronRight, Home, Download, Image, Music, Video } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface FileItem {
  name: string;
  type: "folder" | "file";
  size?: string;
  modified?: string;
}

export const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState("Home");
  
  const files: FileItem[] = [
    { name: "Documents", type: "folder" },
    { name: "Downloads", type: "folder" },
    { name: "Pictures", type: "folder" },
    { name: "Music", type: "folder" },
    { name: "Videos", type: "folder" },
    { name: "README.txt", type: "file", size: "1.2 KB", modified: "2024-01-15" },
    { name: "Welcome.txt", type: "file", size: "856 B", modified: "2024-01-15" },
  ];

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
                    key={index}
                    className="hover:bg-muted/30 cursor-pointer border-b border-border/10"
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
