import { useState, useCallback } from "react";
import ProfileSection from "@/components/ProfileSection";
import ChatSection from "@/components/ChatSection";
import GetInTouchSection from "@/components/GetInTouchSection";
import BootSequence from "@/components/BootSequence";
import MatrixRain from "@/components/MatrixRain";
import TerminalFooter from "@/components/TerminalFooter";
import TerminalHeader from "@/components/TerminalHeader";

const hasBooted = (): boolean => {
  try {
    return !!sessionStorage.getItem("boot_done");
  } catch {
    return true;
  }
};

const Index = () => {
  const [booting, setBooting] = useState(!hasBooted());

  const handleBootComplete = useCallback(() => {
    try {
      sessionStorage.setItem("boot_done", "1");
    } catch {
      // ignore
    }
    setBooting(false);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--term-bg)", color: "var(--term-text)", position: "relative" }}
    >
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Boot sequence overlay */}
      {booting && <BootSequence onComplete={handleBootComplete} />}

      {/* Main content */}
      <div
        className="page-enter"
        style={{ position: "relative", zIndex: 1, opacity: booting ? 0 : 1, transition: booting ? "none" : "opacity 0.45s ease-in" }}
      >
        <TerminalHeader />

        {/* Page sections */}
        <div className="animate-fade-in-up">
          <ProfileSection />
        </div>
        <div className="animate-fade-in-up-delay-1">
          <ChatSection />
        </div>
        <div className="animate-fade-in-up-delay-2">
          <GetInTouchSection />
        </div>

        <TerminalFooter />
      </div>
    </div>
  );
};

export default Index;
