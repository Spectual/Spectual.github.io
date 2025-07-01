import { Link, useLocation } from "react-router-dom";
import ProfileSection from "@/components/ProfileSection";
import ChatSection from "@/components/ChatSection";

const Index = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse animation-delay-4000" style={{ animationDuration: '10s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header Navigation */}
        <header className="py-6 px-6">
          <nav className="max-w-6xl mx-auto">
            <div className="flex space-x-8">
              <Link 
                to="/" 
                className={`font-medium transition-colors ${
                  location.pathname === "/" 
                    ? "text-cyan-400 border-b-2 border-cyan-400 pb-1" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Chat
              </Link>
              <Link 
                to="/resume" 
                className={`font-medium transition-colors ${
                  location.pathname === "/resume" 
                    ? "text-cyan-400 border-b-2 border-cyan-400 pb-1" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Resume
              </Link>
              <Link 
                to="/projects" 
                className={`font-medium transition-colors ${
                  location.pathname === "/projects" 
                    ? "text-cyan-400 border-b-2 border-cyan-400 pb-1" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Projects
              </Link>
            </div>
          </nav>
        </header>

        {/* Profile Section */}
        <ProfileSection />

        {/* Chat Section */}
        <ChatSection />
      </div>
    </div>
  );
};

export default Index;
