import { Download, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Chat" },
  { to: "/resume", label: "Resume" },
  { to: "/projects", label: "Projects" },
];

const Resume = () => {
  const location = useLocation();

  const resumeLinks = {
    googleDrive: "https://drive.google.com/file/d/1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1/view?usp=sharing",
    directDownload: "https://drive.google.com/uc?export=download&id=1hlQVo5WIfv4bDgYR-6iq4l90mPY6Sqz1"
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <div className="relative z-10">
        {/* Header Navigation */}
        <header className="py-5 px-6 border-b border-stone-800/60">
          <nav className="max-w-4xl mx-auto">
            <div className="flex space-x-7">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm font-medium transition-colors pb-1 ${
                    location.pathname === to
                      ? "text-[#cf6b47] border-b border-[#cf6b47]/70"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        {/* Resume Content */}
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-stone-100 mb-2 tracking-tight">Resume</h1>
                <p className="text-stone-400 text-base">
                  View my professional experience and skills
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  onClick={() => window.open(resumeLinks.googleDrive, '_blank')}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 hover:border-stone-600 transition-all duration-150"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Open in Google Drive
                </Button>
                <Button
                  onClick={() => window.open(resumeLinks.directDownload, '_blank')}
                  className="bg-[#cf6b47]/20 hover:bg-[#cf6b47]/30 text-[#cf6b47] border border-[#cf6b47]/30 hover:border-[#cf6b47]/50 transition-all duration-150"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* Resume Display */}
              <Card className="bg-stone-800/50 border-stone-700/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-stone-300 text-sm font-medium">Yifei_Bao_BU_MSCS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[800px] rounded-lg overflow-hidden border border-stone-700/60">
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
