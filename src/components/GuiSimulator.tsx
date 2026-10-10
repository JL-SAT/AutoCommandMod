import { useState, useEffect, useRef } from 'react';
import { MacroItem, ProfileData } from '../types/macro';
import { getKeyName, getLwjglCodeFromEvent } from '../utils/lwjglKeys';
import { playMinecraftClickSound } from '../utils/audio';
import { Volume2, VolumeX } from 'lucide-react';

interface GuiSimulatorProps {
  profiles: ProfileData[];
  currentProfileName: string;
  onUpdateProfiles: (profiles: ProfileData[], activeName: string) => void;
  onTriggerMacro?: (macro: MacroItem) => void;
}

export function GuiSimulator({
  profiles,
  currentProfileName,
  onUpdateProfiles,
  onTriggerMacro,
}: GuiSimulatorProps) {
  // Audio toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playClick = (pitch = 1.0) => {
    if (soundEnabled) playMinecraftClickSound(pitch);
  };

  // Active profile
  const activeProfile = profiles.find((p) => p.name === currentProfileName) || profiles[0];
  const macros = activeProfile?.macros || [];

  // Left sidebar state
  const [profileInput, setProfileInput] = useState('');
  const [editingProfileName, setEditingProfileName] = useState('');

  // Right workspace macro inputs
  const [bindedKey, setBindedKey] = useState<number>(0);
  const [listeningForKey, setListeningForKey] = useState(false);
  const [standardCommand, setStandardCommand] = useState('/');
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  // Dynamic Timeline Sequence Builder State
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  // stepTypes: true = Command, false = Delay
  const [stepTypes, setStepTypes] = useState<boolean[]>([true]);
  const [stepTexts, setStepTexts] = useState<string[]>(['/']);

  // Cached states when toggling between standard and advanced modes
  const [cachedSteps, setCachedSteps] = useState<{ types: boolean[]; texts: string[] }>({
    types: [],
    texts: [],
  });
  const [previousStandardText, setPreviousStandardText] = useState('/');

  // Scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keyboard listening effect for Keybind button
  useEffect(() => {
    if (!listeningForKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const code = getLwjglCodeFromEvent(e);
      playClick(1.1);

      if (code === 1) {
        // ESCAPE cancels listening
        setListeningForKey(false);
        return;
      }

      setBindedKey(code);
      setListeningForKey(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listeningForKey, soundEnabled]);

  // Handle Mode Toggle
  const handleToggleMode = () => {
    playClick();
    if (!isAdvancedMode) {
      // Switching to Sequence Builder
      const activeText = standardCommand.trim() || '/';
      setIsAdvancedMode(true);

      if (cachedSteps.types.length > 0 && activeText === previousStandardText) {
        setStepTypes([...cachedSteps.types]);
        setStepTexts([...cachedSteps.texts]);
      } else {
        setStepTypes([true]);
        setStepTexts([activeText !== '/' ? activeText : '/']);
      }
    } else {
      // Switching to Standard Mode
      const firstText = stepTexts.length > 0 && stepTypes[0] ? stepTexts[0] : '/';
      setCachedSteps({ types: [...stepTypes], texts: [...stepTexts] });
      setPreviousStandardText(firstText);
      setIsAdvancedMode(false);
      setStandardCommand(firstText);
    }
  };

  // Add Step (Max 5)
  const handleAddStep = (isCommand: boolean) => {
    playClick();
    if (stepTypes.length < 5) {
      setStepTypes([...stepTypes, isCommand]);
      setStepTexts([...stepTexts, isCommand ? '/' : '1.0']);
    }
  };

  // Remove Step
  const handleRemoveStep = (index: number) => {
    playClick();
    if (stepTypes.length > 1) {
      const nextTypes = [...stepTypes];
      const nextTexts = [...stepTexts];
      nextTypes.splice(index, 1);
      nextTexts.splice(index, 1);
      setStepTypes(nextTypes);
      setStepTexts(nextTexts);
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    playClick(0.9);
    setEditingIndex(-1);
    setBindedKey(0);
    setIsAdvancedMode(false);
    setStandardCommand('/');
    setStepTypes([true]);
    setStepTexts(['/']);
    setCachedSteps({ types: [], texts: [] });
  };

  // Save / Add Macro
  const handleSaveMacro = () => {
    if (bindedKey === 0) return;
    playClick(1.2);

    let compiledCommand = '';
    if (isAdvancedMode) {
      const segments: string[] = [];
      for (let i = 0; i < stepTypes.length; i++) {
        const val = stepTexts[i]?.trim();
        if (!val) continue;
        if (stepTypes[i]) {
          segments.push(val);
        } else {
          segments.push(`delay:${val}`);
        }
      }
      compiledCommand = segments.join(' ;; ');
    } else {
      compiledCommand = standardCommand.trim();
    }

    if (!compiledCommand || compiledCommand === '/') return;

    const newMacro: MacroItem = {
      id: editingIndex !== -1 && macros[editingIndex] ? macros[editingIndex].id : `macro_${Date.now()}`,
      keyCode: bindedKey,
      keyName: getKeyName(bindedKey),
      command: compiledCommand,
    };

    let updatedMacros = [...macros];
    if (editingIndex !== -1 && editingIndex < updatedMacros.length) {
      updatedMacros[editingIndex] = newMacro;
    } else {
      updatedMacros.push(newMacro);
    }

    const nextProfiles = profiles.map((p) =>
      p.name === activeProfile.name ? { ...p, macros: updatedMacros } : p
    );

    onUpdateProfiles(nextProfiles, activeProfile.name);

    // Reset inputs
    setEditingIndex(-1);
    setBindedKey(0);
    setIsAdvancedMode(false);
    setStandardCommand('/');
    setStepTypes([true]);
    setStepTexts(['/']);
    setCachedSteps({ types: [], texts: [] });
  };

  // Delete Macro
  const handleDeleteMacro = (index: number) => {
    playClick(0.8);
    if (editingIndex === index) setEditingIndex(-1);
    const updatedMacros = macros.filter((_, i) => i !== index);
    const nextProfiles = profiles.map((p) =>
      p.name === activeProfile.name ? { ...p, macros: updatedMacros } : p
    );
    onUpdateProfiles(nextProfiles, activeProfile.name);
  };

  // Start Editing Macro
  const handleStartEdit = (index: number) => {
    playClick();
    const macro = macros[index];
    if (!macro) return;

    setEditingIndex(index);
    setBindedKey(macro.keyCode);
    setCachedSteps({ types: [], texts: [] });
    setPreviousStandardText('/');

    if (macro.command.includes(' ;; ') || macro.command.startsWith('delay:')) {
      setIsAdvancedMode(true);
      const segments = macro.command.split(' ;; ');
      const types: boolean[] = [];
      const texts: string[] = [];
      for (let s = 0; s < segments.length && s < 5; s++) {
        const seg = segments[s].trim();
        if (seg.startsWith('delay:')) {
          types.push(false);
          texts.push(seg.substring(6).trim());
        } else {
          types.push(true);
          texts.push(seg);
        }
      }
      setStepTypes(types.length > 0 ? types : [true]);
      setStepTexts(texts.length > 0 ? texts : ['/']);
    } else {
      setIsAdvancedMode(false);
      setStandardCommand(macro.command);
    }
  };

  // Create or Rename Profile
  const handleProfileSubmit = () => {
    playClick();
    const clean = profileInput.trim().replace(/[^a-zA-Z0-9 ]/g, '');
    if (!clean) return;

    if (editingProfileName) {
      // Renaming existing profile
      const nextProfiles = profiles.map((p) =>
        p.name === editingProfileName ? { ...p, name: clean } : p
      );
      const activeName = activeProfile.name === editingProfileName ? clean : activeProfile.name;
      onUpdateProfiles(nextProfiles, activeName);
      setEditingProfileName('');
      setProfileInput('');
    } else {
      // Creating new profile
      if (profiles.some((p) => p.name.toLowerCase() === clean.toLowerCase())) {
        return;
      }
      const newProf: ProfileData = { name: clean, macros: [] };
      onUpdateProfiles([...profiles, newProf], clean);
      setProfileInput('');
    }
  };

  // Switch Profile
  const handleSelectProfile = (pName: string) => {
    playClick();
    if (pName === activeProfile.name) return;
    onUpdateProfiles(profiles, pName);
    setEditingIndex(-1);
    setBindedKey(0);
    setStandardCommand('/');
    setEditingProfileName('');
    setProfileInput('');
    setIsAdvancedMode(false);
    setStepTypes([true]);
    setStepTexts(['/']);
  };

  // Delete Profile
  const handleDeleteProfile = (pName: string) => {
    playClick(0.7);
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.name !== pName);
    const nextActive = activeProfile.name === pName ? remaining[0].name : activeProfile.name;
    onUpdateProfiles(remaining, nextActive);
    if (editingProfileName === pName) {
      setEditingProfileName('');
      setProfileInput('');
    }
  };

  return (
    <section id="simulator" className="p-6 lg:p-12 max-w-7xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-850 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight">
            In-Game Menu Demo
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5 max-w-xl">
            Test creating profiles, binding keys, and setting up timed macros.
          </p>
        </div>

        {/* Audio control */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
              soundEnabled
                ? 'bg-neutral-800 text-emerald-400 border-neutral-700'
                : 'bg-neutral-900 text-neutral-500 border-neutral-800'
            }`}
            title="Toggle Minecraft UI Click Sounds"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Click Sound: On' : 'Click Sound: Off'}</span>
          </button>
        </div>
      </div>

      {/* Main Minecraft GUI Screen Window */}
      <div className="w-full relative rounded-lg overflow-hidden border border-neutral-700 shadow-2xl bg-neutral-950 font-mono select-none">
        {/* In-Game Window Title Header Bar */}
        <div className="bg-[#141414] px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
            <span className="text-neutral-200 font-semibold">Minecraft Macro Configuration (Command: /macros)</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400">
            <span>Press ESC while binding to cancel</span>
          </div>
        </div>

        {/* 25% / 75% Split Container matching GuiMacroConfig */}
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[540px]">
          {/* ========================================================= */}
          {/* LEFT SIDEBAR (25%): PROFILES */}
          {/* ========================================================= */}
          <div className="md:col-span-1 bg-[#0a0a0a] border-r border-[#262626] p-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header "Profiles" */}
              <div className="text-[#55FF55] text-sm font-bold tracking-wide">Saved Profiles</div>

              {/* Subtitle */}
              <div className="text-[#888888] text-xs">
                {editingProfileName ? 'Rename Profile:' : 'Create New Profile:'}
              </div>

              {/* Profile input field */}
              <input
                type="text"
                value={profileInput}
                maxLength={14}
                placeholder="e.g. Minigames..."
                onChange={(e) => setProfileInput(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleProfileSubmit();
                }}
                className="w-full bg-[#000000] text-neutral-200 border border-[#444444] focus:border-[#55FF55] focus:outline-none px-2.5 py-1.5 text-xs"
              />

              {/* Create/Update Profile Button */}
              <button
                onClick={handleProfileSubmit}
                className="w-full bg-[#2b2b2b] hover:bg-[#383838] active:bg-[#1a1a1a] text-neutral-200 border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#555] border-l-[#555] border-b-[#111] border-r-[#111] py-1.5 px-2 text-xs font-semibold cursor-pointer text-center transition-colors"
              >
                {editingProfileName ? 'Update Name' : 'Create Profile'}
              </button>

              {/* Available Profiles list */}
              <div className="pt-2">
                <div className="text-[#888888] text-xs mb-2">Click to switch profile:</div>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                  {profiles.map((p) => {
                    const isActive = p.name === activeProfile.name;
                    const isBeingRenamed = p.name === editingProfileName;

                    return (
                      <div
                        key={p.name}
                        onClick={() => handleSelectProfile(p.name)}
                        className={`group flex items-center justify-between px-2.5 py-2 text-xs border border-transparent cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-[#152a15] text-[#55FF55] border-[#2e5e2e]'
                            : isBeingRenamed
                            ? 'bg-[#152535] text-[#55FFFF]'
                            : 'hover:bg-[#191919] text-[#aaaaaa] hover:text-white'
                        }`}
                      >
                        <span className="truncate">
                          {isActive && <span className="mr-1.5 font-bold">&gt;</span>}
                          {p.name}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0 ml-1 opacity-80 group-hover:opacity-100">
                          {/* Rename pencil icon button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playClick();
                              setEditingProfileName(p.name);
                              setProfileInput(p.name);
                            }}
                            className="w-4 h-4 bg-[#111] hover:bg-[#33aaaa] border border-[#444] flex items-center justify-center text-[10px] text-amber-300 cursor-pointer"
                            title="Rename Profile"
                          >
                            ✎
                          </button>

                          {/* Delete profile button (only if > 1 profile) */}
                          {profiles.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProfile(p.name);
                              }}
                              className="w-4 h-4 bg-[#111] hover:bg-[#aa3333] border border-[#444] flex items-center justify-center text-[10px] text-[#FF4444] font-bold cursor-pointer"
                              title="Delete Profile"
                            >
                              X
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Profile info footer note */}
            <div className="text-[11px] text-[#777777] pt-4 border-t border-[#222]">
              Active: <span className="text-[#55FF55] font-bold">{activeProfile.name}</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT WORKSPACE (75%): MACRO CONTROLS & TIMELINE */}
          {/* ========================================================= */}
          <div className="md:col-span-3 bg-[#101010] p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header and Edit state */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#55FF55] text-sm font-bold tracking-wide">
                    Configure Keybind
                  </div>
                  <div className="text-[#aaaaaa] text-xs">
                    {editingIndex !== -1
                      ? 'Editing existing macro record:'
                      : 'Create a new key shortcut:'}
                  </div>
                </div>

                {editingIndex !== -1 && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-[#331111] hover:bg-[#4a1717] text-[#ff6666] border border-[#aa3333] text-xs cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {/* Mode Toggle Button & Keybind Listener Button Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleToggleMode}
                  className="w-full sm:w-auto flex-1 bg-[#2b2b2b] hover:bg-[#383838] active:bg-[#1a1a1a] text-neutral-200 border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#555] border-l-[#555] border-b-[#111] border-r-[#111] py-2 px-3 text-xs font-semibold cursor-pointer text-center"
                >
                  {isAdvancedMode ? 'Switch to Single Command Mode' : 'Switch to Multi-Step Sequence Mode'}
                </button>

                <button
                  onClick={() => {
                    playClick(1.2);
                    setListeningForKey(true);
                  }}
                  className={`w-full sm:w-52 py-2 px-3 text-xs font-semibold border-t-2 border-l-2 border-b-2 border-r-2 cursor-pointer transition-colors text-center ${
                    listeningForKey
                      ? 'bg-[#443311] text-[#ffee55] border-t-[#aa8822] border-l-[#aa8822] border-b-[#221100] border-r-[#221100] animate-pulse'
                      : bindedKey !== 0
                      ? 'bg-[#153520] text-[#55FF55] border-t-[#33aa55] border-l-[#33aa55] border-b-[#051505] border-r-[#051505]'
                      : 'bg-[#2b2b2b] hover:bg-[#383838] text-neutral-200 border-t-[#555] border-l-[#555] border-b-[#111] border-r-[#111]'
                  }`}
                >
                  {listeningForKey
                    ? 'Press any key...'
                    : bindedKey !== 0
                    ? `Key: [${getKeyName(bindedKey)}]`
                    : 'Click to Choose Key'}
                </button>
              </div>

              {/* Mode-Specific Inputs */}
              {isAdvancedMode ? (
                /* Dynamic Timeline Sequence Step Inputs */
                <div className="bg-[#090909] p-3.5 border border-[#222] space-y-3">
                  <div className="text-[11px] text-[#aaa] flex items-center justify-between">
                    <span>Multi-Step Sequence (Up to 5 steps)</span>
                    <span className="text-[#888]">Set custom pauses in seconds</span>
                  </div>

                  <div className="space-y-2">
                    {stepTypes.map((isCmd, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {/* Step Label Badge */}
                        <div className="w-28 shrink-0 bg-[#000] border border-[#333] px-2.5 py-1.5 text-xs">
                          <span className={isCmd ? 'text-white' : 'text-[#ffaaaa]'}>
                            Step {idx + 1}: {isCmd ? 'Command' : 'Wait'}
                          </span>
                        </div>

                        {/* Step Input */}
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={stepTexts[idx] || ''}
                            maxLength={isCmd ? 80 : 5}
                            placeholder={isCmd ? '/command' : '1.0'}
                            onChange={(e) => {
                              const next = [...stepTexts];
                              next[idx] = e.target.value;
                              setStepTexts(next);
                            }}
                            className="w-full bg-[#000] text-neutral-100 border border-[#444] focus:border-[#55FF55] focus:outline-none px-2.5 py-1.5 text-xs"
                          />
                          {!isCmd && (
                            <span className="absolute right-2.5 top-1.5 text-[11px] text-[#777]">
                              seconds
                            </span>
                          )}
                        </div>

                        {/* Step Delete Button */}
                        {stepTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="w-6 h-6 bg-[#000] hover:bg-[#aa3333] border border-[#444] text-[#ff4444] text-xs font-bold flex items-center justify-center cursor-pointer shrink-0"
                            title="Remove Step"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Command / Add Delay buttons */}
                  {stepTypes.length < 5 && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleAddStep(true)}
                        className="bg-[#202020] hover:bg-[#2e2e2e] text-[#55FF55] border border-[#444] px-3 py-1 text-xs cursor-pointer"
                      >
                        + Add Command Step
                      </button>
                      <button
                        onClick={() => handleAddStep(false)}
                        className="bg-[#202020] hover:bg-[#2e2e2e] text-[#FFAA55] border border-[#444] px-3 py-1 text-xs cursor-pointer"
                      >
                        + Add Pause Step
                      </button>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={handleSaveMacro}
                    disabled={bindedKey === 0}
                    className={`w-full py-2.5 px-4 text-xs font-bold border-t-2 border-l-2 border-b-2 border-r-2 cursor-pointer transition-colors text-center mt-2 ${
                      bindedKey === 0
                        ? 'bg-[#1c1c1c] text-[#555] border-[#333] cursor-not-allowed'
                        : 'bg-[#2b2b2b] hover:bg-[#383838] text-white border-t-[#555] border-l-[#555] border-b-[#111] border-r-[#111]'
                    }`}
                  >
                    {editingIndex !== -1 ? 'Update Sequence' : 'Save Sequence Macro'}
                  </button>
                </div>
              ) : (
                /* Standard Mode Input */
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={standardCommand}
                    maxLength={100}
                    placeholder="/warp spawn or /say Hello"
                    onChange={(e) => setStandardCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveMacro();
                    }}
                    className="w-full bg-[#000] text-neutral-100 border border-[#444] focus:border-[#55FF55] focus:outline-none px-3 py-2 text-xs"
                  />

                  <button
                    onClick={handleSaveMacro}
                    disabled={bindedKey === 0}
                    className={`w-full py-2.5 px-4 text-xs font-bold border-t-2 border-l-2 border-b-2 border-r-2 cursor-pointer transition-colors text-center ${
                      bindedKey === 0
                        ? 'bg-[#1c1c1c] text-[#555] border-[#333] cursor-not-allowed'
                        : 'bg-[#2b2b2b] hover:bg-[#383838] text-white border-t-[#555] border-l-[#555] border-b-[#111] border-r-[#111]'
                    }`}
                  >
                    {editingIndex !== -1 ? 'Update Macro' : 'Save Single Command Macro'}
                  </button>
                </div>
              )}

              {/* Macro Records List */}
              <div className="pt-2 border-t border-[#222]">
                <div className="text-xs text-[#888] mb-2 flex items-center justify-between">
                  <span>Keys Bound in {activeProfile.name} ({macros.length})</span>
                  <span className="text-[11px] text-[#666]">
                    Click &quot;TEST&quot; to test in sandbox below
                  </span>
                </div>

                <div
                  ref={scrollRef}
                  className="max-h-[220px] overflow-y-auto space-y-1.5"
                >
                  {macros.length === 0 ? (
                    <div className="text-[#555555] text-xs py-6 text-center italic">
                      No macros configured in this profile yet. Click &quot;Click to Choose Key&quot; above to add one!
                    </div>
                  ) : (
                    macros.map((m, idx) => {
                      const isEditing = editingIndex === idx;
                      const hasSequence = m.command.includes(' ;; ') || m.command.startsWith('delay:');

                      return (
                        <div
                          key={m.id || idx}
                          className={`flex items-center justify-between p-2.5 text-xs border transition-colors ${
                            isEditing
                              ? 'bg-[#142634] border-[#3388aa]'
                              : 'bg-[#000000] hover:bg-[#141414] border-[#252525]'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {/* Key indicator */}
                            <span
                              className={`font-bold shrink-0 ${
                                isEditing ? 'text-[#55FFFF]' : 'text-[#FFFFAA]'
                              }`}
                            >
                              [{m.keyName || getKeyName(m.keyCode)}]
                            </span>

                            {/* Command representation */}
                            <span
                              className={`truncate font-mono ${
                                isEditing
                                  ? 'text-[#55FFFF]'
                                  : hasSequence
                                  ? 'text-[#FFAAFF]'
                                  : 'text-neutral-200'
                              }`}
                              title={m.command}
                            >
                              {m.command.replace(/ ;; /g, ' → ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {/* Live Test Trigger Button */}
                            {onTriggerMacro && (
                              <button
                                type="button"
                                onClick={() => {
                                  playClick(1.3);
                                  onTriggerMacro(m);
                                }}
                                className="px-2.5 py-1 bg-[#1a2f1a] hover:bg-[#284828] text-[#55FF55] border border-[#2b592b] text-[11px] cursor-pointer"
                                title="Test fire this macro in the live chat"
                              >
                                TEST
                              </button>
                            )}

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleStartEdit(idx)}
                              className={`px-2.5 py-1 border text-[11px] cursor-pointer ${
                                isEditing
                                  ? 'bg-[#33aaaa] text-white border-[#55dddd]'
                                  : 'bg-[#222222] hover:bg-[#33aaaa] text-[#aaaaaa] hover:text-white border-[#444]'
                              }`}
                            >
                              EDIT
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteMacro(idx)}
                              className="px-2.5 py-1 bg-[#222222] hover:bg-[#aa3333] text-[#FF4444] border border-[#444] text-[11px] font-bold cursor-pointer"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div className="pt-4 border-t border-[#222] text-[11px] text-[#777] flex flex-wrap items-center justify-between gap-2">
              <div>
                Tip: Press your keyboard hotkey anytime while playing Minecraft to trigger your macro.
              </div>
              <div className="text-neutral-400">
                Works on Singleplayer &amp; Multiplayer
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
