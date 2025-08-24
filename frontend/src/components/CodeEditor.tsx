import type { FileNode } from "@/types";
import { Button } from "@/uicomponents/ui/button";
import { Editor } from "@monaco-editor/react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Badge, ChevronLeft, ChevronRight, Code, Eye, FileIcon, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

interface props {
  fileStructure: FileNode[]
}
export default function CodeEditor({
  fileStructure
}: props) {
  const [isFileExplorerCollapsed, setIsFileExplorerCollapsed] = useState<boolean>(true)
  const [selectedFile, setSelectedFile] = useState<string | null>('index.html');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components']));

  console.log(fileStructure)

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };
  const getFileLanguage = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'jsx': return 'javascript';
      case 'tsx': return 'typescript';
      default: return 'plaintext';
    }
  };
  const getFileContent = (filePath: string): string => {
    const findFile = (myFiles: FileNode[], pathNodes: string[]): FileNode | null => {
      for (let i = 0; i < pathNodes.length; i++) {
        let j = 0;
        let filee: FileNode[] | undefined = myFiles;
        while (j < i) {
          filee = filee?.find(({ name, type }) => name === pathNodes[j] && type === 'folder')?.children
          j++;
        }
        const filecheck = filee?.find(({ name, type }) => name === pathNodes[i] && type === "file")
        if (filecheck) {
          return filecheck;
        }
      }
      return null
    };
    const pathParts = filePath.split('/');
    console.log(pathParts)
    // fileStructure.forEach((fileNode) => {
    const file = findFile(fileStructure, pathParts)
    if (file) { return file?.content || ''; }
    // })
    return '';
  };
  const renderFileTree = (node: FileNode, path: string = '', level: number = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(currentPath);

    return (
      <div key={currentPath} className="" >
        <div
          className={`flex items-center gap-2 py-1 px-2 overflow-hidden hover:bg-gray-100 cursor-pointer rounded ${selectedFile === currentPath ? 'bg-blue-50 text-blue-700' : ''
            }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(currentPath);
            } else {
              setSelectedFile(currentPath);
            }
          }}
        >
          {node.type === 'folder' ? (
            isExpanded ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-500" />
          ) : (
            <FileIcon className="w-4 h-4" fileName={node.name} />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileTree(child, currentPath, level + 1))}
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      {/* File Explorer & Code Editor */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        {/* File Explorer (collapsible with animation) */}
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col overflow-hidden
    ${isFileExplorerCollapsed ? "w-8" : "w-56"}`}
        >
          {/* Header */}
          <div className="px-2 py-3 border-b border-gray-200 flex items-center justify-between">
            {!isFileExplorerCollapsed && (
              <h3 className="text-sm font-semibold text-gray-700">Project Files</h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFileExplorerCollapsed(!isFileExplorerCollapsed)}
              className="h-6 w-6 p-0 cursor-pointer"
            >
              {isFileExplorerCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* File Tree */}
          {!isFileExplorerCollapsed && (
            <ScrollArea className="h-full">
              {fileStructure.map((fileStructureItem) => (
                <div key={fileStructureItem.path} className="p-[1px]">
                  {renderFileTree(fileStructureItem)}
                </div>
              ))}
            </ScrollArea>
          )}

          {/* Label for Collapsed State */}
          {isFileExplorerCollapsed && (
            <div className="mt-2 -rotate-90 text-xs text-gray-500 whitespace-nowrap">
              Files
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-stone-800">
          <div className="px-4 py-3 border-b border-stone-800 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-black">{selectedFile || '/'}</span>
              {selectedFile && (
                <Badge variant="secondary" className="text-xs">
                  {selectedFile.split('.').pop()?.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">

            </div>
          </div>
          <div className="h-[calc(100%-56px)]">
            {selectedFile ? (
              <Editor
                height="100%"
                width="100%"
                language={getFileLanguage(selectedFile)}
                value={getFileContent(selectedFile)}
                theme="vs-dark"
                options={{
                  readOnly: false,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on'
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a file to view its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}