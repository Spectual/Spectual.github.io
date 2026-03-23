import { personalInfo } from "@/data/personalInfo";
import { ExternalLink, Github, Globe, Award, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Chat" },
  { to: "/resume", label: "Resume" },
  { to: "/projects", label: "Projects" },
];

const Projects = () => {
  const location = useLocation();

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

        {/* Projects Content */}
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-stone-100 mb-2 tracking-tight">Projects</h1>
                <p className="text-stone-400 text-base">
                  Explore my technical projects and research work
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid gap-4 lg:grid-cols-2">
                {personalInfo.projects.map((project, index) => (
                  <Card
                    key={index}
                    className="bg-stone-800/50 border-stone-700/60 hover:bg-stone-800 hover:border-stone-700 transition-all duration-200"
                  >
                    <CardHeader className="pb-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-stone-100 text-base leading-snug flex items-center gap-2">
                          {project.name.includes("Patent") && (
                            <Award className="w-4 h-4 text-[#cf6b47] shrink-0" />
                          )}
                          {project.name}
                        </CardTitle>
                        <div className="flex gap-1.5 shrink-0">
                          {"githubUrl" in project && project.githubUrl && (
                            <a
                              href={project.githubUrl as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-stone-700/50 hover:bg-stone-700 text-stone-400 hover:text-stone-200 rounded-lg transition-all duration-150"
                              title="View on GitHub"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {"liveUrl" in project && project.liveUrl && (
                            <a
                              href={project.liveUrl as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-stone-700/50 hover:bg-stone-700 text-stone-400 hover:text-stone-200 rounded-lg transition-all duration-150"
                              title="View Live"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-stone-400 leading-relaxed mb-3.5 text-sm">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="bg-stone-700/50 text-stone-400 border-stone-600/50 hover:bg-stone-700 text-xs px-2 py-0.5"
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
              <div className="mt-6 p-5 bg-stone-800/40 rounded-xl border border-stone-700/60">
                <h3 className="text-base font-semibold text-stone-200 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-stone-400" />
                  More Projects
                </h3>
                <p className="text-stone-400 text-sm mb-4">
                  For more detailed project information, code repositories, and live demos,
                  feel free to ask me in the Chat section or visit my GitHub profile.
                </p>
                <a
                  href={personalInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-200 rounded-full transition-all duration-150 text-sm font-medium"
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
