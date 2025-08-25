import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/uicomponents/ui/button";
import { Progress } from "@/uicomponents/ui/progress";
import { Badge } from "@/uicomponents/ui/badge";
import { ScrollArea } from "@/uicomponents/ui/scroll-area";
import { Separator } from "@/uicomponents/ui/separator";
import { Input } from "@/uicomponents/ui/input";
import { ArrowLeft, Check, Clock, Download, Eye, Send, MessageSquare } from "lucide-react";
import { BACKEND_URL } from "@/config";
import { parseXmll } from "@/steps";
import { StepType, type Step, type llmMessage } from "@/types";
import axios from "axios";
import CodeEditor from "@/components/CodeEditor";
import { type FileNode } from "@/types";
import Preview from "@/components/Preview";
import { useWebContainer } from "@/hooks/useWebContainer";
import type { FileSystemTree } from "@webcontainer/api";
import { DownloadZip } from "@/components/DownloadZip";

export default function Build() {
  const location = useLocation();
  const navigate = useNavigate();
  const webcontainer = useWebContainer();
  const [prompt] = useState<string>(location.state?.prompt || "");

  const [progress, setProgress] = useState(0);
  const [chatMessage, setChatMessage] = useState("");

  const [files, setFiles] = useState<FileNode[]>([]);
  const [llmMsg, setLlmMsg] = useState<llmMessage[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [preview, setPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [llmMsg])

  // const initi = async () => {
  //   const parsed = parseXmll(basePrompt);
  //   setSteps(parsed);
  // }

  useEffect(() => {
    const init = async () => {
      if (!prompt.trim()) {
        navigate("/");
      }
      const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim()
      })
      const { prompts, uiPrompts } = response.data;
      setSteps(parseXmll(uiPrompts[0]));
      setLlmMsg((llmMsg) => [...llmMsg, ...prompts.map((msg: string) => {
        return {
          role: "user",
          parts: [{ text: msg }]
        }
      })])
      setLoading(true);
      const chatresponse = await axios.post(`${BACKEND_URL}/chat`, {
        prompt: prompt,
        messages: llmMsg
      })
      const initllmres = chatresponse.data.response
      setLlmMsg([...llmMsg, {
        role: "model",
        parts: [{
          text: initllmres
        }]
      }])
      setSteps([...steps, ...parseXmll(initllmres)])
      setLoading(false)
    }
    init();
  }, [])

  useEffect(() => {
    function fileNodesToTree(nodes: FileNode[]): FileSystemTree {
      const tree: FileSystemTree = {};
      for (const node of nodes) {
        if (node.type === "file") {
          tree[node.name] = { file: { contents: node.content ?? "" } };
        } else {
          tree[node.name] = { directory: fileNodesToTree(node.children ?? []), };
        }
      }
      return tree;
    }
    const mountedFileStructure = fileNodesToTree(files);
    console.log("check")
    console.log(mountedFileStructure);
    webcontainer?.mount(mountedFileStructure);
  }, [files, webcontainer]);


  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    let myFiles: FileNode[] = [...files]
    console.log(steps)
    console.log("steps-files", myFiles)
    let updateHappened = false;
    steps.map((step, index) => {
      sleep(2000);
      setProgress((index + 1) * 100 / steps.length)
      if (step.status === "pending" && step.type == StepType.CreateFile) {
        const unreferrencedFiles = [...myFiles];
        const rFiles = unreferrencedFiles;
        updateHappened = true;
        const pathNodes: string[] = step.path?.split("/") ?? [];
        if (pathNodes.length == 1 && step.code) {
          const file = unreferrencedFiles.find(({ name, path, type }) => name === step.title && step.path === path && type === 'file')
          if (!file) {
            unreferrencedFiles.push({
              name: step.title,
              type: "file",
              content: step.code,
              path: step.path ?? ""
            })
          } else {
            file.content = step.code
          }
        } else {
          for (let i = 0; i < pathNodes.length; i++) {
            if (i == pathNodes.length - 1) {
              let j = 0;
              let filee: FileNode[] | undefined = unreferrencedFiles;
              while (j < i) {
                filee = filee?.find(({ name, type }) => name === pathNodes[j] && type === 'folder')?.children
                j++;
              }
              const filecheck = filee?.find(({ name, type }) => name === pathNodes[i] && type === "file")
              if (!filecheck) {
                filee?.push({
                  name: pathNodes[i],
                  type: 'file',
                  content: step.code,
                  path: pathNodes.join("/")
                })
              } else {
                filecheck.content = step.code
              }
            } else {
              let j = 0;
              let filee: FileNode[] | undefined = unreferrencedFiles;
              while (j < i) {
                filee = filee?.find(({ name, type }) => name === pathNodes[j] && type === 'folder')?.children
                j++;
              }
              const folder = filee?.find(({ name, type, content }) => name === pathNodes[i] && type === "folder" && content === undefined)
              if (!folder) {
                filee?.push({
                  name: pathNodes[i],
                  type: 'folder',
                  children: [],
                  path: pathNodes.slice(0, i + 1).join("/")
                })
              }
            }
          }
        }
        myFiles = rFiles;
      }
    })
    if (updateHappened) {
      console.log(myFiles)
      setFiles(myFiles)
      setSteps(steps.map((step) => { return { ...step, status: 'completed' } }))
    }
  }, [steps, files])


  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    setLoading(true);
    const chatresponse = await axios.post(`${BACKEND_URL}/chat`, {
      prompt: chatMessage,
      messages: llmMsg
    })
    const initllmres = chatresponse.data.response
    setLlmMsg([...llmMsg, {
      role: "user",
      parts: [{ text: chatMessage }]
    }, {
      role: "model",
      parts: [{
        text: initllmres
      }]
    }])
    console.log("llmMsg")
    console.log(llmMsg)
    setSteps([...steps, ...parseXmll(initllmres)])
    setLoading(false)
    setChatMessage('');
  };

  const cutText = (text: string) => {
    console.log("Cutting Text")
    return text.substring(0, text.indexOf("<repelArtifact>"))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && <div hidden={true} >Loading skeleton</div>}


      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-lg font-semibold">Repel</h1>
              <p className="text-sm text-gray-600 truncate max-w-md">{prompt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setPreview(preview => !preview)} >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button onClick={() => DownloadZip(files)} variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </header>


      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-80 min-w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Generation Progress</h2>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : step.status === 'active'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                      }`}>
                      {step.status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : step.status === 'active' ? (
                        <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-medium ${step.status === 'completed' ? 'text-green-700' :
                          step.status === 'active' ? 'text-blue-700' : 'text-gray-500'
                          }`}>
                          {step.title}
                        </h3>
                        {step.status === 'completed' && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.floor(Math.random() * (5 - 1 + 1)) + 1}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Updating...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">AI Assistant</h3>
            </div>
            
            <ScrollArea className="flex-1 p-4 h-36">
              <div className="space-y-3">
                {llmMsg.map((message, index) => (
                  <div
                    hidden={index < 2}
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {message.role === "user" && message.parts[0].text}
                      {message.role === "model" && cutText(message.parts[0].text)}
                    </div>
                  </div>
                ))}
                {/* 👇 this invisible div will be the scroll target */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendMessage} disabled={!chatMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {!preview && <CodeEditor fileStructure={files} />}
        {preview && webcontainer != undefined && <Preview webContainer={webcontainer} />}
      </div>
    </div>
  );
}
