import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function PageWrapper({ children, title, subtitle }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-[#090d0b] text-white p-6 md:p-12 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(16,185,129,0.09) 0%, transparent 100%)",
            "radial-gradient(circle, rgba(255,255,255,0.032) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "100% 100%, 28px 28px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-10">
          <h1 className="animate-in fade-in slide-in-from-top-4 duration-500 text-3xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="animate-in fade-in slide-in-from-top-2 duration-500 delay-150 fill-mode-backwards text-white/40 mt-2">
            {subtitle}
          </p>
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300 fill-mode-backwards ease-out">
          {children}
        </main>
      </div>
    </div>
  );
}
