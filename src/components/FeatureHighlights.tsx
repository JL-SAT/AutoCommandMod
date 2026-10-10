import { Zap, Clock, FolderOpen, Sliders, ShieldCheck, Gamepad2 } from 'lucide-react';

export function FeatureHighlights() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      title: 'Single-Key Shortcuts',
      description: 'Trigger any command instantly with one keypress.',
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      title: 'Timed Action Chains',
      description: 'Chain up to 5 actions with custom pauses between steps.',
    },
    {
      icon: <FolderOpen className="w-5 h-5 text-emerald-400" />,
      title: 'Multiple Profiles',
      description: 'Create and switch hotkey sets for PvP, Minigames, or Survival.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-amber-400" />,
      title: 'Clean In-Game Menu',
      description: 'Type /macros in chat to bind keys and manage setups.',
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-emerald-400" />,
      title: 'Zero Frame Drops',
      description: 'Background timing queue runs without freezing gameplay.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      title: 'Multiplayer Compatible',
      description: 'Sends standard player chat commands without needing OP permissions.',
    },
  ];

  return (
    <section id="features" className="p-6 lg:p-12 max-w-7xl mx-auto space-y-5">
      <div className="border-b border-neutral-850 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight">
          Features
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
          Fast, lag-free command hotkeys for Minecraft 1.8.9.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg space-y-2 hover:border-neutral-700 transition-colors"
          >
            <div className="p-2 bg-neutral-950 w-fit rounded border border-neutral-800">
              {f.icon}
            </div>
            <h3 className="text-sm font-bold text-neutral-100">{f.title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
