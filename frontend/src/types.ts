export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}

export interface Step {
  id: number;
  title: string;
  type: StepType;
  status: 'pending' | 'active' | 'completed';
  code?: string;
  path?: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  path: string;
}

export interface Project {
  prompt: string;
  steps: Step[];
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path: string;
}

export interface FileViewerProps {
  file: FileItem | null;
  onClose: () => void;
}


export interface llmMessage  {
  role: "user" | "model",
  parts: [llmMessageText]
}

export interface llmMessageText { text: string }