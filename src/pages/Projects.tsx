import { personalInfo } from "@/data/personalInfo";
import { ExternalLink, Github, Globe, Award, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";

const Projects = () => {
  const location = useLocation();

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

        {/* Projects Content */}
        <div className="px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-4">
                  Projects
                </h1>
                <p className="text-slate-300 text-lg">
                  Explore my technical projects and research work
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {personalInfo.projects.map((project, index) => (
                  <Card key={index} className="bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white text-xl mb-2 flex items-center gap-2">
                            {project.name.includes("Patent") && (
                              <Award className="w-5 h-5 text-yellow-400" />
                            )}
                            {project.name}
                          </CardTitle>
                        </div>
                        <div className="flex gap-2">
                          {/* Add project links here if available */}
                          {project.name.includes("GitHub") && (
                            <a
                              href="#"
                              className="p-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-full transition-all duration-300 hover:scale-110"
                              title="View on GitHub"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          <a
                            href="#"
                            className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-full transition-all duration-300 hover:scale-110"
                            title="View Project"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 leading-relaxed mb-4">
                        {project.description}
                      </p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-600/30"
                          >
                            <Code className="w-3 h-3 mr-1" />
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-purple-900/20 rounded-xl border border-purple-500/30">
                <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  More Projects
                </h3>
                <p className="text-slate-300 text-sm">
                  For more detailed project information, code repositories, and live demos, 
                  feel free to ask me in the Chat section or visit my GitHub profile.
                </p>
                <div className="mt-4">
                  <a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm font-medium">View GitHub Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects; 