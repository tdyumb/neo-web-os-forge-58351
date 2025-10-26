import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface FileData {
  id: string;
  name: string;
  content: string;
  type: "text" | "folder";
  size: number;
  modified: string;
  folder: string;
}

interface FileSystemContextType {
  files: FileData[];
  createFile: (name: string, content: string, folder?: string) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  getFile: (id: string) => FileData | undefined;
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

  const createFile = (name: string, content: string, folder: string = "Home") => {
    const newFile: FileData = {
      id: `file-${Date.now()}`,
      name: name.endsWith(".txt") ? name : `${name}.txt`,
      content,
      type: "text",
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

  return (
    <FileSystemContext.Provider
      value={{ files, createFile, updateFile, deleteFile, getFile }}
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
