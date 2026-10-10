import { useState } from 'react';
import { CheckCircle2, Gamepad2, Sparkles, Copy, Check, Download } from 'lucide-react';

export function AboutProject() {
  const [copied, setCopied] = useState(false);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('/macros');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="about" className="p-6 lg:p-12 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-850 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight">
          Installation
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
          How to install and use the mod in Forge 1.8.9.
        </p>
      </div>

      {/* Challenge & Solution Grid (Concise) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-1.5">
          <div className="text-xs font-bold text-neutral-400 uppercase">The Problem</div>
          <h3 className="text-sm font-bold text-neutral-100">Repetitive Command Typing</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Typing commands mid-game is slow and interrupts gameplay.
          </p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-1.5">
          <div className="text-xs font-bold text-emerald-400 uppercase">The Solution</div>
          <h3 className="text-sm font-bold text-neutral-100">One-Tap Hotkeys &amp; Combos</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Trigger commands instantly or chain actions with custom pauses using an in-game menu.
          </p>
        </div>
      </div>

      {/* 3 Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Visual In-Game UI</span>
          </div>
          <p className="text-xs text-neutral-400">
            Configure keys directly in-game without editing config files.
          </p>
        </div>

        <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pause Control</span>
          </div>
          <p className="text-xs text-neutral-400">
            Custom pauses keep commands from getting blocked by spam filters.
          </p>
        </div>

        <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded-lg space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Multiplayer Safe</span>
          </div>
          <p className="text-xs text-neutral-400">
            Works on any public server without requiring OP or server plugins.
          </p>
        </div>
      </div>

      {/* 3-Step Installation */}
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
        <h3 className="text-sm font-bold text-neutral-100">
          How to Install in 3 Steps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded space-y-1">
            <div className="font-bold text-emerald-400">Step 1: Install Forge</div>
            <div className="text-neutral-300">
              Install Minecraft Forge for 1.8.9.
            </div>
          </div>

          <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded space-y-2 flex flex-col justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-emerald-400">Step 2: Add Mod File</div>
              <div className="text-neutral-300">
                Drop the <span className="font-mono text-emerald-400">.jar</span> into <span className="font-mono text-neutral-400">.minecraft/mods</span>.
              </div>
            </div>
            <a
              href="/%5B1.8.9%5D%20AutoCommandMod.jar"
              download="[1.8.9] AutoCommandMod.jar"
              className="mt-1 w-full py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download [1.8.9] Mod</span>
            </a>
          </div>

          <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded space-y-1">
            <div className="font-bold text-emerald-400">Step 3: Open Menu</div>
            <div className="text-neutral-300">
              In-game, type <span className="font-mono text-emerald-400 font-bold">/macros</span> in chat to open settings.
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs">
          <span className="text-neutral-400">Chat command:</span>
          <button
            onClick={handleCopyCmd}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-mono font-bold rounded flex items-center gap-1.5 cursor-pointer border border-neutral-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy: /macros'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
