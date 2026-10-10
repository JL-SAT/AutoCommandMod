import { Download } from 'lucide-react';

interface TopNavProps {
  onNavigate: (sectionId: string) => void;
}

export function TopNav({ onNavigate }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 lg:px-12 py-3.5 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      {/* Zone 1: Wordmark without "Minecraft" */}
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('hero');
        }}
        className="text-base font-bold tracking-tight text-neutral-100 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
      >
        Auto Command Mod
      </a>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-300">
        <button
          onClick={() => onNavigate('features')}
          className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Features
        </button>
        <button
          onClick={() => onNavigate('screenshots')}
          className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Screenshots
        </button>
        <button
          onClick={() => onNavigate('simulator')}
          className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          In-Game Menu
        </button>
        <button
          onClick={() => onNavigate('sandbox')}
          className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Live Tester
        </button>
        <button
          onClick={() => onNavigate('about')}
          className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Installation
        </button>
      </nav>

      {/* Zone 3: Primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="/%5B1.8.9%5D%20AutoCommandMod.jar"
          download="[1.8.9] AutoCommandMod.jar"
          className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm inline-flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download .jar</span>
        </a>
      </div>
    </header>
  );
}
