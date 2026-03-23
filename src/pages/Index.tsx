import { Link, useLocation } from "react-router-dom";
import ProfileSection from "@/components/ProfileSection";
import ChatSection from "@/components/ChatSection";
import GetInTouchSection from "@/components/GetInTouchSection";

const NAV_LINKS = [
  { to: "/", label: "Chat" },
  { to: "/resume", label: "Resume" },
  { to: "/projects", label: "Projects" },
];

const Index = () => {
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

        {/* Profile Section */}
        <div className="animate-fade-in-up">
          <ProfileSection />
        </div>

        {/* Chat Section */}
        <div className="animate-fade-in-up-delay-1">
          <ChatSection />
        </div>

        {/* Get In Touch Section */}
        <div className="animate-fade-in-up-delay-2">
          <GetInTouchSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
