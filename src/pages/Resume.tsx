import { Download, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";

const Resume = () => {
  const location = useLocation();

  // 简历链接配置
  const resumeLinks = {
    googleDrive: "https://drive.google.com/file/d/1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1/view?usp=sharing",
    directDownload: "https://drive.google.com/uc?export=download&id=1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
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

        {/* Resume Content */}
        <div className="px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">
                  Resume
                </h1>
                <p className="text-slate-300 text-lg">
                  View my professional experience and skills
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button
                  onClick={() => window.open(resumeLinks.googleDrive, '_blank')}
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Open in Google Drive
                </Button>
                <Button
                  onClick={() => window.open(resumeLinks.directDownload, '_blank')}
                  className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* Resume Display */}
              <Card className="bg-white/5 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Yifei_Bao_BU_MSCS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[800px] rounded-lg overflow-hidden border border-white/20">
                    <iframe
                      src="https://drive.google.com/file/d/1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1/preview"
                      className="w-full h-full"
                      title="Resume PDF"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume; 