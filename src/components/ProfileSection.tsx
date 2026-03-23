import { personalInfo } from "@/data/personalInfo";
import { Linkedin, Github, MapPin, Mail } from "lucide-react";

const ProfileSection = () => {
  return (
    <section className="px-6 pb-8 animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-cyan-400 via-emerald-500 to-blue-500 p-[3px] shadow-2xl shadow-cyan-900/30">
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.name}
                  className="w-full h-full rounded-full object-cover bg-slate-800"
                  loading="eager"
                />
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full" title="Open to opportunities" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent mb-2">
                {personalInfo.name}
              </h1>
              <p className="text-xl lg:text-2xl text-emerald-300 mb-4 font-medium tracking-wide">
                {personalInfo.title}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-5 text-slate-300">
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors text-sm">
                  <Mail size={15} className="text-cyan-400" />
                  {personalInfo.email}
                </a>
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin size={15} className="text-cyan-400" />
                  {personalInfo.location}
                </div>
              </div>

              {/* Bio */}
              <p className="text-slate-300 leading-relaxed mb-5 max-w-2xl text-sm lg:text-base">
                {personalInfo.background}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
                {personalInfo.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-slate-800/70 border border-white/10 text-slate-300 rounded-full text-xs font-medium hover:border-cyan-500/40 hover:text-cyan-300 transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-3">
                {personalInfo.social?.linkedin && (
                  <a
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-full transition-all duration-200 hover:scale-105 text-sm font-medium border border-blue-500/20 hover:border-blue-400/40"
                  >
                    <Linkedin size={16} />
                    LinkedIn
                  </a>
                )}
                {personalInfo.social?.github && (
                  <a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-full transition-all duration-200 hover:scale-105 text-sm font-medium border border-white/10 hover:border-white/20"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
