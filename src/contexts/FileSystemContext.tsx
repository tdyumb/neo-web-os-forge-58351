import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface FileData {
  id: string;
  name: string;
  content: string;
  type: "text" | "folder";
  extension: string;
  size: number;
  modified: string;
  folder: string;
}

interface FileSystemContextType {
  files: FileData[];
  createFile: (name: string, content: string, folder?: string, extension?: string) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  getFile: (id: string) => FileData | undefined;
  downloadFile: (id: string) => void;
  uploadFile: (file: File, folder?: string) => Promise<void>;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

const STORAGE_KEY = "neo-os-files";

export const FileSystemProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    const savedFiles = localStorage.getItem(STORAGE_KEY);
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error("Failed to load files:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const createFile = (name: string, content: string, folder: string = "Home", extension: string = ".txt") => {
    const fileName = name.includes(".") ? name : `${name}${extension}`;
    const ext = fileName.substring(fileName.lastIndexOf("."));
    
    const newFile: FileData = {
      id: `file-${Date.now()}`,
      name: fileName,
      content,
      type: "text",
      extension: ext,
      size: new Blob([content]).size,
      modified: new Date().toISOString().split("T")[0],
      folder,
    };
    setFiles((prev) => [...prev, newFile]);
  };

  const updateFile = (id: string, content: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              content,
              size: new Blob([content]).size,
              modified: new Date().toISOString().split("T")[0],
            }
          : file
      )
    );
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const getFile = (id: string) => {
    return files.find((file) => file.id === id);
  };

  const downloadFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;

    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uploadFile = async (file: File, folder: string = "Home"): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const ext = file.name.substring(file.name.lastIndexOf(".")) || ".txt";
        
        const newFile: FileData = {
          id: `file-${Date.now()}`,
          name: file.name,
          content,
          type: "text",
          extension: ext,
          size: file.size,
          modified: new Date().toISOString().split("T")[0],
          folder,
        };
        setFiles((prev) => [...prev, newFile]);
        resolve();
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  return (
    <FileSystemContext.Provider
      value={{ files, createFile, updateFile, deleteFile, getFile, downloadFile, uploadFile }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error("useFileSystem must be used within FileSystemProvider");
  }
  return context;
};
