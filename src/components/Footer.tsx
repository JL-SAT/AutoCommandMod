interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 px-6 lg:px-12 py-8 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center md:text-left">
          <div className="text-sm font-bold text-neutral-200">
            Auto Command Mod
          </div>
          <div className="text-neutral-500 text-[11px]">
            Forge 1.8.9 Client Utility Mod
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-5 text-xs">
          <button
            onClick={() => onNavigate('hero')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('features')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('screenshots')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Screenshots
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            In-Game Menu
          </button>
          <button
            onClick={() => onNavigate('sandbox')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Live Tester
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Installation
          </button>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500">
        <div>Built for Minecraft 1.8.9. Type /macros in-game to configure.</div>
        <div>Not affiliated with Mojang Studios.</div>
      </div>
    </footer>
  );
}
