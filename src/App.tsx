import { useState } from 'react';
import { ProfileData } from './types/macro';
import { TopNav } from './components/TopNav';
import { Hero } from './components/Hero';
import { FeatureHighlights } from './components/FeatureHighlights';
import { InGameScreenshots } from './components/InGameScreenshots';
import { GuiSimulator } from './components/GuiSimulator';
import { LiveConsoleSandbox } from './components/LiveConsoleSandbox';
import { AboutProject } from './components/AboutProject';
import { Footer } from './components/Footer';

// Default profiles matching the exact in-game screenshot from the user's Minecraft client
const INITIAL_PROFILES: ProfileData[] = [
  {
    name: 'PvP',
    macros: [
      {
        id: 'm1',
        keyCode: 41, // GRAVE (`)
        keyName: 'GRAVE',
        command: '/kit health ;; delay:1.0 ;; /kit potions',
      },
      {
        id: 'm2',
        keyCode: 16, // Q
        keyName: 'Q',
        command: '/spawn',
      },
      {
        id: 'm3',
        keyCode: 24, // O
        keyName: 'O',
        command: '/warp pvp',
      },
    ],
  },
  {
    name: 'Skyblock',
    macros: [
      {
        id: 'm4',
        keyCode: 33, // F
        keyName: 'F',
        command: '/wardrobe 1 ;; delay:0.3 ;; /warp dungeon ;; delay:1.0 ;; /party Ready',
      },
      {
        id: 'm5',
        keyCode: 35, // H
        keyName: 'H',
        command: '/is home',
      },
    ],
  },
];

export default function App() {
  const [profiles, setProfiles] = useState<ProfileData[]>(INITIAL_PROFILES);
  const [activeProfileName, setActiveProfileName] = useState<string>('PvP');

  const activeProfile = profiles.find((p) => p.name === activeProfileName) || profiles[0];

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Test macro directly in sandbox
  const handleFireInSandbox = (command: string) => {
    scrollTo('sandbox');
    window.dispatchEvent(
      new CustomEvent('sandbox-fire-command', { detail: { command } })
    );
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950 overflow-x-hidden">
      {/* Top Bar */}
      <TopNav onNavigate={scrollTo} />

      <main className="w-full space-y-12 py-2">
        {/* Hero Section */}
        <Hero
          onOpenSimulator={() => scrollTo('simulator')}
          onOpenSandbox={() => scrollTo('sandbox')}
        />

        {/* Feature Highlights */}
        <FeatureHighlights />

        {/* Real In-Game Screenshots Gallery */}
        <InGameScreenshots onTryInteractive={() => scrollTo('simulator')} />

        {/* 1:1 In-Game Menu Simulator */}
        <GuiSimulator
          profiles={profiles}
          currentProfileName={activeProfileName}
          onUpdateProfiles={(newProfiles, activeName) => {
            setProfiles(newProfiles);
            setActiveProfileName(activeName);
          }}
          onTriggerMacro={(macro) => {
            handleFireInSandbox(macro.command);
          }}
        />

        {/* Live Chat & Action Tester */}
        <LiveConsoleSandbox
          macros={activeProfile.macros}
          activeProfileName={activeProfile.name}
          onOpenGui={() => scrollTo('simulator')}
        />

        {/* Project Overview & 3-Step Installation (includes chat command photo) */}
        <AboutProject />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollTo} />
    </div>
  );
}
