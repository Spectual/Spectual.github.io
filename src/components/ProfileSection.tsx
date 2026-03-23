import { personalInfo } from "@/data/personalInfo";
import { Linkedin, Github, MapPin, Mail, ArrowUpRight } from "lucide-react";

const ProfileSection = () => {
  return (
    <section className="px-6 py-10 animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full border-2 border-stone-700 overflow-hidden">
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover bg-stone-800"
                  loading="eager"
                />
              </div>
              {/* Availability indicator */}
              <span
                className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-stone-900 rounded-full"
                title="Open to opportunities"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-stone-100 mb-1.5 tracking-tight">
                {personalInfo.name}
              </h1>
              <p className="text-lg text-[#cf6b47] mb-4 font-medium">
                {personalInfo.title}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-5 text-stone-400 text-sm">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-1.5 hover:text-stone-200 transition-colors"
                >
                  <Mail size={14} />
                  {personalInfo.email}
                </a>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {personalInfo.location}
                </div>
              </div>

              {/* Bio */}
              <p className="text-stone-400 leading-relaxed mb-6 max-w-2xl text-sm lg:text-base">
                {personalInfo.background}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
                {personalInfo.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 border border-stone-700 text-stone-400 rounded-full text-xs font-medium hover:border-stone-500 hover:text-stone-300 transition-all duration-150"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-5">
                {personalInfo.social?.linkedin && (
                  <a
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition-colors text-sm font-medium group"
                  >
                    <Linkedin size={15} />
                    LinkedIn
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {personalInfo.social?.github && (
                  <a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition-colors text-sm font-medium group"
                  >
                    <Github size={15} />
                    GitHub
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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
