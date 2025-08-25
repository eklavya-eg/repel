import JSZip from "jszip";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
  path: string;
}

export async function DownloadZip(nodes: FileNode[], zipName = "project.zip") {
  const zip = new JSZip();

  function traverse(zipFolder: JSZip, fileNodes: FileNode[]) {
    for (const node of fileNodes) {
      if (node.type === "file" && node.content !== undefined) {
        zipFolder.file(node.name, node.content);
      } else if (node.type === "folder" && node.children) {
        const folder = zipFolder.folder(node.name);
        if (folder) traverse(folder, node.children);
      }
    }
  }

  traverse(zip, nodes);

  const blob = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = zipName;
  link.click();
}
