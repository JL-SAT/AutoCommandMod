import { Terminal, Sliders, ArrowDown } from 'lucide-react';

interface InGameScreenshotsProps {
  onTryInteractive: () => void;
}

export function InGameScreenshots({ onTryInteractive }: InGameScreenshotsProps) {
  return (
    <section id="screenshots" className="p-6 lg:p-12 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-850 pb-3 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight">
            In-Game Captures
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Real gameplay captures from Minecraft Forge 1.8.9.
          </p>
        </div>

        <button
          onClick={onTryInteractive}
          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-neutral-700 text-xs font-semibold rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <span>Try Interactive Menu</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Main In-Game Menu Screenshot */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-xl">
        <div className="w-full bg-neutral-950">
          <img
            src="/screenshots/guiexample.png"
            alt="Minecraft 1.8.9 In-Game Macro Configuration Menu"
            className="w-full h-auto object-contain block"
          />
        </div>

        {/* Caption Bar */}
        <div className="p-3 bg-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border-t border-neutral-800">
          <div className="font-semibold text-neutral-200 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>In-Game Menu with PvP &amp; Skyblock profiles</span>
          </div>

          <div className="text-emerald-400 font-mono text-[11px] shrink-0 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
            Active: PvP
          </div>
        </div>
      </div>

      {/* 2. In-Game Chat Command Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-semibold text-neutral-200 text-xs flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Menu Command</span>
          </div>
          <p className="text-xs text-neutral-400">
            Type <code className="text-emerald-400 font-mono font-bold">/macros</code> in chat to open the menu anytime.
          </p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded p-1.5 shrink-0 shadow-sm">
          <img
            src="/screenshots/chatcommand.png"
            alt="Minecraft chat prompt showing /macros command"
            className="w-full sm:w-64 h-auto rounded object-contain block"
          />
        </div>
      </div>
    </section>
  );
}
