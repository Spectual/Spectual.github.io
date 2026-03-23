import { personalInfo } from "@/data/personalInfo";
import { ExternalLink, Github, Globe, Award, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";

const Projects = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header Navigation */}
        <header className="py-6 px-6">
          <nav className="max-w-6xl mx-auto">
            <div className="flex space-x-8">
              {[
                { to: "/", label: "Chat" },
                { to: "/resume", label: "Resume" },
                { to: "/projects", label: "Projects" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`font-medium transition-colors ${
                    location.pathname === to
                      ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        {/* Projects Content */}
        <div className="px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-3">
                  Projects
                </h1>
                <p className="text-slate-300 text-lg">
                  Explore my technical projects and research work
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {personalInfo.projects.map((project, index) => (
                  <Card
                    key={index}
                    className="bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-cyan-900/20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-white text-lg leading-snug flex items-center gap-2">
                          {project.name.includes("Patent") && (
                            <Award className="w-5 h-5 text-yellow-400 shrink-0" />
                          )}
                          {project.name}
                        </CardTitle>
                        {/* Only render link buttons when real URLs exist */}
                        <div className="flex gap-2 shrink-0">
                          {"githubUrl" in project && project.githubUrl && (
                            <a
                              href={project.githubUrl as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 rounded-full transition-all duration-200 hover:scale-110"
                              title="View on GitHub"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {"liveUrl" in project && project.liveUrl && (
                            <a
                              href={project.liveUrl as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-full transition-all duration-200 hover:scale-110"
                              title="View Live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 leading-relaxed mb-4 text-sm">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-600/30 text-xs"
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

              {/* More Projects */}
              <div className="mt-8 p-6 bg-emerald-900/20 rounded-xl border border-emerald-500/30">
                <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  More Projects
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  For more detailed project information, code repositories, and live demos,
                  feel free to ask me in the Chat section or visit my GitHub profile.
                </p>
                <a
                  href={personalInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium"
                >
                  <Github className="w-4 h-4" />
                  View GitHub Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
