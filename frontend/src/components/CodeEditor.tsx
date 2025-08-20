import type { FileNode } from "@/types";
import { Button } from "@/uicomponents/ui/button";
import { Editor } from "@monaco-editor/react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Badge, ChevronLeft, ChevronRight, Code, Eye, FileIcon, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

interface props {
  fileStructure: FileNode
}
export default function CodeEditor({
  fileStructure
}: props) {
  const [isFileExplorerCollapsed, setIsFileExplorerCollapsed] = useState<boolean>(true)
  const [selectedFile, setSelectedFile] = useState<string | null>('index.html');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'components']));


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
      default: return 'plaintext';
    }
  };
  const getFileContent = (filePath: string): string => {
    const findFile = (node: FileNode, path: string[]): FileNode | null => {
      if (path.length === 0) return node;
      if (node.type === 'file') return null;

      const [first, ...rest] = path;
      const child = node.children?.find(c => c.name === first);
      if (!child) return null;

      return rest.length === 0 ? child : findFile(child, rest);
    };

    const pathParts = filePath.split('/').filter(p => p !== 'my-website');
    const file = findFile(fileStructure, pathParts);
    return file?.content || '';
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
            <FileIcon fileName={node.name} />
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
        {!isFileExplorerCollapsed && (
          <div className="w-80 bg-white border-r border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Project Files</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFileExplorerCollapsed(true)}
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-full">
              <div className="p-2">
                {renderFileTree(fileStructure)}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Collapsed File Explorer Toggle */}
        {isFileExplorerCollapsed && (
          <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFileExplorerCollapsed(false)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="mt-2 -rotate-90 text-xs text-gray-500 whitespace-nowrap">
              Files
            </div>
          </div>
        )}

        {/* Code Editor */}
        <div className="flex-1 bg-gray-900">
          <div className="px-4 py-3 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-100">{selectedFile || 'No file selected'}</span>
              {selectedFile && (
                <Badge variant="secondary" className="text-xs">
                  {selectedFile.split('.').pop()?.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </div>
          </div>
          <div className="h-[calc(100%-56px)]">
            {selectedFile ? (
              <Editor
                height="100%"
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