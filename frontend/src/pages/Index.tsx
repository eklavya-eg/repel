import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/uicomponents/ui/button";
import { Textarea } from "@/uicomponents/ui/textarea";
import { Card, CardContent } from "@/uicomponents/ui/card";
import { ArrowRight, Sparkles, Code, Star, Rocket, Palette } from "lucide-react";

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateWebsite = async () => {
    console.log("laksf;dj")
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    // Simulate a brief loading state for UX
    setTimeout(() => {
      navigate("/build", { state: { prompt } });
    }, 800);
  };

  const examplePrompts = [
    "Create a modern portfolio website for a graphic designer",
    "Create an e-commerce store for handmade jewelry",
    "Create a SaaS landing page for a productivity app",
    "Create a restaurant website with online ordering"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg-3 pattern-dots"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-indigo-100/90"></div>


      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg glow-blue">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-animated">
              repel
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="outline" size="sm" className="gradient-border scale-hover">Contact</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 gradient-border-slow pulse-glow">
            <Sparkles className="w-5 h-5 gradient-text-1" />
            <span className="gradient-text-1">AI-Powered Website Generation</span>
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            repel
          </h1>
          

          {/* Main Input Section */}
          <div className="relative">
            <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm scale-hover">
              <CardContent className="p-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label htmlFor="prompt" className="text-left block text-xl font-bold text-gray-800">
                      <span className="gradient-text-1">Describe your website</span>
                    </label>
                    <div className="relative">
                      <Textarea
                        id="prompt"
                        placeholder="E.g., A modern landing page for my photography business with a portfolio gallery, contact form, and about section. I want it to have a clean, minimalist design with a dark theme..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[140px] text-lg resize-none border-2 border-gray-200 focus:border-transparent focus:ring-4 focus:ring-blue-500/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl"></div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCreateWebsite}
                    disabled={!prompt.trim() || isLoading}
                    className="w-full h-14 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-xl glow-blue cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="gradient-text-3">Creating your masterpiece...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Rocket className="w-6 h-6" />
                        Create Website
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Example Prompts */}
          <div className="mt-16">
            <p className="text-sm text-gray-600 mb-6 font-medium">Try one of these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="group text-left p-4 text-sm bg-white/70 hover:bg-white/90 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 hover:shadow-lg scale-hover shimmer relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="text-gray-700 font-medium mb-1">
                      "{example}"
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      Click to use
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center glow-blue">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-animated">repel</span>
          </div>
          <p className="text-gray-400 mb-4">Empowering creators with AI-driven web development</p>
          <p className="text-gray-500">© 2025 repel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
