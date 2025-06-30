import { personalInfo } from "@/data/personalInfo";
import { Linkedin, Github, MapPin, Mail } from "lucide-react";

const ProfileSection = () => {
  return (
    <section className="px-6 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-1 shadow-2xl">
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.name}
                  className="w-full h-full rounded-full object-cover bg-gray-200"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 via-purple-500/30 to-pink-500/30 animate-pulse"></div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-3">
                {personalInfo.name}
              </h1>
              <p className="text-xl lg:text-2xl text-purple-300 mb-4 font-medium">
                {personalInfo.title}
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-cyan-400" />
                  <span className="text-sm">{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-cyan-400" />
                  <span className="text-sm">{personalInfo.location}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-slate-300 leading-relaxed mb-6 max-w-2xl">
                {personalInfo.background}
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                {personalInfo.social?.linkedin && (
                <a
                  href={personalInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Linkedin size={20} />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
                )}
                {personalInfo.social?.github && (
                <a
                  href={personalInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Github size={20} />
                  <span className="text-sm font-medium">GitHub</span>
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
