import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/uicomponents/ui/button";
import { Progress } from "@/uicomponents/ui/progress";
import { Badge } from "@/uicomponents/ui/badge";
import { ScrollArea } from "@/uicomponents/ui/scroll-area";
import { Separator } from "@/uicomponents/ui/separator";
import { Input } from "@/uicomponents/ui/input";
import { ArrowLeft, Check, Clock, FileText, Folder, FolderOpen, Image, Code, Settings, Palette, Globe, Download, Eye, ChevronLeft, ChevronRight, Send, MessageSquare } from "lucide-react";
import { BACKEND_URL } from "@/config";
import { parseXml } from "@/steps";
import { StepType, type Step } from "@/types";
import axios from "axios";
import CodeEditor from "@/components/CodeEditor";


interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

export default function Build() {
  const location = useLocation();
  const navigate = useNavigate();
  const prompt = location.state?.prompt || "";

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'system', content: 'Website generation started. I\'m analyzing your requirements...' },
    { id: 2, type: 'system', content: 'Created design system with modern blue theme.' },
    { id: 3, type: 'system', content: 'Building responsive layout components...' }
  ]);

  // const [steps, setSteps] = useState<Step[]>([]);
  // const [templateSet, setTemplateSet] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  // const init = async () => {
  //   if (!prompt.trim()) {
  //     navigate("/");
  //   }
  //   const response = await axios.post(`${BACKEND_URL}/template`, {
  //     prompt: prompt.trim()
  //   })
  //   setTemplateSet(true);
  //   const { prompts, uiPrompts } = response.data;
  //   // setSteps(parseXml(uiPrompts[0]).map((step: Step) => (
  //   //   { ...step }
  //   // )));
  //   setSteps(parseXml(uiPrompts[0]));
  //   setLoading(true);
  // }

  // useEffect(() => {
  //   init();
  // }, [])

  const steps: Step[] = [
    {
      id: 1,
      title: 'Analyzing Requirements',
      description: 'Understanding your website requirements and target audience',
      type: StepType.CreateFile,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Creating Design System',
      description: 'Generating color palette, typography, and layout structure',
      type: StepType.CreateFile,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Building Site Structure',
      description: 'Creating page hierarchy and navigation flow',
      type: StepType.CreateFolder,
      status: 'completed'
    },
    {
      id: 4,
      title: 'Generating Components',
      description: 'Building reusable UI components and sections',
      type: StepType.CreateFile,
      status: 'active'
    },
    {
      id: 5,
      title: 'Adding Content',
      description: 'Populating with relevant text, images, and media',
      type: StepType.EditFile,
      status: 'pending'
    },
    {
      id: 6,
      title: 'Optimization & Testing',
      description: 'Ensuring performance, accessibility, and responsiveness',
      type: StepType.RunScript,
      status: 'pending'
    },
    {
      id: 7,
      title: 'Ready to Deploy',
      description: 'Your website is ready for production',
      type: StepType.RunScript,
      status: 'pending'
    }
  ];
  const fileStructure: FileNode = {
    name: 'my-website',
    type: 'folder',
    children: [
      {
        name: 'index.html',
        type: 'file',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Beautiful Website</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <header class="hero-section">
        <nav class="navbar">
            <div class="logo">MyBrand</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
        <div class="hero-content">
            <h1>Welcome to My Amazing Website</h1>
            <p>Crafted with precision and powered by AI</p>
            <button class="cta-button">Get Started</button>
        </div>
    </header>
    
    <main>
        <section id="about" class="section">
            <div class="container">
                <h2>About Us</h2>
                <p>We create exceptional digital experiences...</p>
            </div>
        </section>
        
        <section id="services" class="section">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    <!-- Service cards will be generated here -->
                </div>
            </div>
        </section>
    </main>
    
    <footer class="footer">
        <p>&copy; 2024 MyBrand. All rights reserved.</p>
    </footer>
    
    <script src="scripts/main.js"></script>
</body>
</html>`
      },
      {
        name: 'styles',
        type: 'folder',
        children: [
          {
            name: 'main.css',
            type: 'file',
            language: 'css',
            content: `/* Modern, responsive CSS */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1f2937;
  --accent-color: #f59e0b;
  --text-dark: #111827;
  --text-light: #6b7280;
  --bg-light: #f9fafb;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: var(--text-dark);
}

.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
}

.nav-links a:hover {
  opacity: 0.8;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
}

.section {
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.footer {
  background: var(--secondary-color);
  color: white;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .nav-links {
    display: none;
  }
}`
          }
        ]
      },
      {
        name: 'scripts',
        type: 'folder',
        children: [
          {
            name: 'main.js',
            type: 'file',
            language: 'javascript',
            content: `// Interactive features for the website
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(31, 41, 55, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});`
          }
        ]
      },
      {
        name: 'images',
        type: 'folder',
        children: [
          {
            name: 'hero-bg.jpg',
            type: 'file'
          },
          {
            name: 'logo.svg',
            type: 'file'
          },
          {
            name: 'about-image.jpg',
            type: 'file'
          }
        ]
      },
      {
        name: 'components',
        type: 'folder',
        children: [
          {
            name: 'header.html',
            type: 'file',
            language: 'html'
          },
          {
            name: 'footer.html',
            type: 'file',
            language: 'html'
          },
          {
            name: 'service-card.html',
            type: 'file',
            language: 'html'
          }
        ]
      },
      {
        name: 'README.md',
        type: 'file',
        language: 'markdown',
        content: `# My Beautiful Website

A modern, responsive website generated by SiteForge AI.

## Features

- ✨ Modern, clean design
- 📱 Fully responsive
- ⚡ Fast loading
- 🎨 Custom color scheme
- 🔧 Easy to customize

## Getting Started

1. Open \`index.html\` in your browser
2. Customize colors in \`styles/main.css\`
3. Update content in \`index.html\`
4. Add your own images to the \`images\` folder

## Deployment

This website is ready to deploy to any hosting platform:
- Netlify
- Vercel
- GitHub Pages
- Any web server

Just upload all files and you're live!`
      }
    ]
  };

  useEffect(() => {
    // Simulate step progression
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 65) {
          return prev + 1;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);


  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      type: 'user' as const,
      content: chatMessage
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: 'system' as const,
        content: 'I understand your request. Let me update the website accordingly...'
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <h1 className="text-lg font-semibold">Creating Your Website</h1>
              <p className="text-sm text-gray-600 truncate max-w-md">"{prompt}"</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Globe className="w-4 h-4" />
              Deploy
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Steps Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Generation Progress */}
          <div className="p-6 border-b border-gray-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Generation Progress</h2>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <ScrollArea className="h-64">


              a
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
                            {step.duration}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">AI Assistant</h3>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <CodeEditor fileStructure={fileStructure} />
      </div>
    </div>
  );
}
