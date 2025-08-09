import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Code, Globe, Zap, Star, Rocket, Palette } from "lucide-react";

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateWebsite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    // Simulate a brief loading state for UX
    setTimeout(() => {
      navigate("/build", { state: { prompt } });
    }, 800);
  };

  const examplePrompts = [
    "A modern portfolio website for a graphic designer",
    "An e-commerce store for handmade jewelry",
    "A SaaS landing page for a productivity app",
    "A restaurant website with online ordering"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg-3 pattern-dots"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-50/80 to-indigo-100/90"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-70 floating"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-xl opacity-60 floating-delayed"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-xl opacity-50 floating-slow"></div>
      <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 floating"></div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg glow-blue">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-animated">
              builder
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 font-medium">Features</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 font-medium">Templates</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 font-medium">Pricing</a>
            <Button variant="outline" size="sm" className="gradient-border scale-hover">Sign In</Button>
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
            Create Beautiful Websites
            <span className="block gradient-text-animated text-6xl md:text-8xl font-extrabold mt-2">
              In Seconds
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Describe your vision and watch as our <span className="gradient-text-2 font-bold">AI transforms</span> your ideas into stunning, 
            production-ready websites. <span className="gradient-text-3 font-bold">No coding required.</span>
          </p>

          {/* Main Input Section */}
          <div className="relative">
            <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm gradient-border scale-hover">
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
                    className="w-full h-14 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-xl glow-blue"
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

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Why Choose <span className="gradient-text-animated">builder</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl glow-blue group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 gradient-text-1">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">Generate complete websites in seconds, not hours or days.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl glow-purple group-hover:scale-110 transition-transform duration-300">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 gradient-text-2">Production Ready</h3>
              <p className="text-gray-600 leading-relaxed">Clean, optimized code that's ready to deploy anywhere.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl glow-pink group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 gradient-text-3">Fully Responsive</h3>
              <p className="text-gray-600 leading-relaxed">Beautiful designs that work perfectly on all devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16 gradient-bg-1">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Websites Created" },
              { number: "99.9%", label: "Uptime" },
              { number: "5 sec", label: "Average Generation" },
              { number: "24/7", label: "AI Support" }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2 floating">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center glow-blue">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text-animated">builder</span>
          </div>
          <p className="text-gray-400 mb-4">Empowering creators with AI-driven web development</p>
          <p className="text-gray-500">© 2024 builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
