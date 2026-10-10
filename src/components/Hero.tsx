import { useState } from 'react';
import { ArrowRight, Play, Clock, Sparkles, Download } from 'lucide-react';
import { playMinecraftExecuteSound } from '../utils/audio';

interface HeroProps {
  onOpenSimulator: () => void;
  onOpenSandbox: () => void;
}

export function Hero({ onOpenSimulator, onOpenSandbox }: HeroProps) {
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isFiring, setIsFiring] = useState(false);

  const triggerHeroDemo = () => {
    if (isFiring) return;
    setIsFiring(true);
    playMinecraftExecuteSound();

    setActiveStep(0);
    setTimeout(() => setActiveStep(1), 500);
    setTimeout(() => {
      playMinecraftExecuteSound();
      setActiveStep(2);
    }, 1000);
    setTimeout(() => setActiveStep(3), 1500);
    setTimeout(() => {
      playMinecraftExecuteSound();
      setActiveStep(4);
      setTimeout(() => {
        setIsFiring(false);
        setActiveStep(-1);
      }, 900);
    }, 2400);
  };

  return (
    <section id="hero" className="relative px-6 lg:px-12 py-10 md:py-16 border-b border-neutral-850 bg-neutral-950">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Shortened copy */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <span>Forge 1.8.9</span>
            <span aria-hidden="true">·</span>
            <span>Client Mod</span>
            <span aria-hidden="true">·</span>
            <span>Multiplayer Safe</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Trigger commands and timed combos with a single key.
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-lg">
            Bind keys to run instant commands or multi-step chains with custom pauses in between.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="/%5B1.8.9%5D%20AutoCommandMod.jar"
              download="[1.8.9] AutoCommandMod.jar"
              className="px-4 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Mod (.jar)</span>
            </a>

            <button
              onClick={onOpenSimulator}
              className="px-4 py-2 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Try In-Game Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-850 text-neutral-300">
            <div>
              <div className="text-lg font-bold text-emerald-400">1-Tap Keys</div>
              <div className="text-xs text-neutral-400">Instant shortcuts</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400">Timed Combos</div>
              <div className="text-xs text-neutral-400">Custom pauses</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400">Profiles</div>
              <div className="text-xs text-neutral-400">Multiple setups</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Visual Card */}
        <div className="lg:col-span-5">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-neutral-200 font-semibold">Example Combo</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                Key: [R]
              </span>
            </div>

            {/* Sequence Flow */}
            <div className="space-y-1.5 text-xs">
              <div className={`p-2 rounded border transition-all flex items-center justify-between ${
                activeStep === 0 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
              }`}>
                <span>Step 1: /heal</span>
                <span className="text-[11px] text-neutral-500">Instant</span>
              </div>

              <div className={`p-1.5 rounded border transition-all flex items-center justify-between ${
                activeStep === 1 ? 'bg-amber-950/60 border-amber-500 text-amber-300' : 'bg-neutral-950/50 border-neutral-850 text-neutral-400'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Step 2: Wait 0.5s</span>
                </div>
                <span className="text-[11px] text-neutral-500">Pause</span>
              </div>

              <div className={`p-2 rounded border transition-all flex items-center justify-between ${
                activeStep === 2 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
              }`}>
                <span>Step 3: /feed</span>
                <span className="text-[11px] text-neutral-500">Instant</span>
              </div>

              <div className={`p-1.5 rounded border transition-all flex items-center justify-between ${
                activeStep === 3 ? 'bg-amber-950/60 border-amber-500 text-amber-300' : 'bg-neutral-950/50 border-neutral-850 text-neutral-400'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Step 4: Wait 1.0s</span>
                </div>
                <span className="text-[11px] text-neutral-500">Pause</span>
              </div>

              <div className={`p-2 rounded border transition-all flex items-center justify-between ${
                activeStep === 4 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
              }`}>
                <span>Step 5: /shout Ready</span>
                <span className="text-[11px] text-neutral-500">Sent to chat</span>
              </div>
            </div>

            <button
              onClick={triggerHeroDemo}
              disabled={isFiring}
              className={`w-full py-2 text-xs font-bold rounded flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                isFiring
                  ? 'bg-emerald-500 text-neutral-950 animate-pulse'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isFiring ? 'Running combo...' : 'Test Key [R]'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
