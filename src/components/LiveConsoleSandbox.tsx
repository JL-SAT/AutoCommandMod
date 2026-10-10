import React, { useState, useEffect, useRef } from 'react';
import { MacroItem, PendingCommand, ChatMessage } from '../types/macro';
import { getLwjglCodeFromEvent } from '../utils/lwjglKeys';
import { playMinecraftExecuteSound } from '../utils/audio';
import { Terminal, Clock, Play, Trash2, Send } from 'lucide-react';

interface LiveConsoleSandboxProps {
  macros: MacroItem[];
  activeProfileName: string;
  onOpenGui: () => void;
}

export function LiveConsoleSandbox({
  macros,
  activeProfileName,
  onOpenGui,
}: LiveConsoleSandboxProps) {
  // Real-time tick simulation (20 ticks/sec = 50ms)
  const [currentTicks, setCurrentTicks] = useState<number>(10420);
  const [isTickRunning, setIsTickRunning] = useState<boolean>(true);
  const [commandQueue, setCommandQueue] = useState<PendingCommand[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      text: '[Server] Welcome! You can press any bound key or type /macros to open settings.',
      timestamp: '12:00:00',
      type: 'system',
    },
    {
      id: 'c2',
      text: '<Player> Testing out my new keybinds.',
      timestamp: '12:00:02',
      type: 'player',
    },
  ]);
  const [inputChat, setInputChat] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Game Tick Loop (20 ticks per second)
  useEffect(() => {
    if (!isTickRunning) return;

    const interval = setInterval(() => {
      setCurrentTicks((prevTick) => {
        const nextTick = prevTick + 1;

        // Process queue
        setCommandQueue((prevQueue) => {
          const remaining: PendingCommand[] = [];
          const executed: PendingCommand[] = [];

          for (const cmd of prevQueue) {
            if (nextTick >= cmd.targetTick) {
              executed.push(cmd);
            } else {
              remaining.push(cmd);
            }
          }

          if (executed.length > 0) {
            playMinecraftExecuteSound();
            const now = new Date().toLocaleTimeString();
            const newMsgs: ChatMessage[] = executed.map((c) => ({
              id: `msg_${Date.now()}_${Math.random()}`,
              text: c.command.startsWith('/')
                ? `[Command Sent] ${c.command}`
                : `<Player> ${c.command}`,
              timestamp: now,
              type: 'macro',
            }));

            setChatMessages((prev) => [...prev, ...newMsgs]);
          }

          return remaining;
        });

        return nextTick;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isTickRunning]);

  // Global Key Listener to fire bound macros while testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const pressedLwjgl = getLwjglCodeFromEvent(e);
      const matched = macros.find((m) => m.keyCode === pressedLwjgl);

      if (matched) {
        e.preventDefault();
        triggerMacroCommand(matched.command);
      }
    };

    const handleCustomFire = (e: Event) => {
      const custom = e as CustomEvent<{ command: string }>;
      if (custom.detail?.command) {
        triggerMacroCommand(custom.detail.command);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('sandbox-fire-command', handleCustomFire);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('sandbox-fire-command', handleCustomFire);
    };
  }, [macros, currentTicks]);

  // Parser implementation
  const triggerMacroCommand = (macroString: string) => {
    if (macroString.includes(' ;; ') || macroString.startsWith('delay:')) {
      const segments = macroString.split(' ;; ');
      let accumulatedDelayTicks = 0;
      const newPendingItems: PendingCommand[] = [];

      for (const segment of segments) {
        const clean = segment.trim();
        if (!clean) continue;

        if (clean.startsWith('delay:')) {
          try {
            const seconds = parseFloat(clean.substring(6).trim());
            accumulatedDelayTicks += Math.round(seconds * 20.0);
          } catch {}
        } else {
          const executionTick = currentTicks + accumulatedDelayTicks;
          newPendingItems.push({
            id: `cmd_${Date.now()}_${Math.random()}`,
            command: clean,
            targetTick: executionTick,
            initialTick: currentTicks,
            progress: 0,
          });
        }
      }

      setCommandQueue((prev) => [...prev, ...newPendingItems]);
    } else {
      // Instant dispatch
      playMinecraftExecuteSound();
      const now = new Date().toLocaleTimeString();
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          text: macroString.startsWith('/')
            ? `[Command Sent] ${macroString}`
            : `<Player> ${macroString}`,
          timestamp: now,
          type: 'macro',
        },
      ]);
    }
  };

  // Chat send form
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputChat.trim();
    if (!clean) return;

    if (clean === '/macros') {
      onOpenGui();
      setInputChat('');
      return;
    }

    const now = new Date().toLocaleTimeString();
    setChatMessages((prev) => [
      ...prev,
      {
        id: `chat_${Date.now()}`,
        text: clean.startsWith('/') ? `[Command Sent] ${clean}` : `<Player> ${clean}`,
        timestamp: now,
        type: 'player',
      },
    ]);
    setInputChat('');
  };

  return (
    <section id="sandbox" className="p-6 lg:p-12 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-850 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight">
            Live Chat Tester
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5 max-w-xl">
            Press your bound keys or click buttons below to see commands fire with realistic pauses.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded text-xs text-neutral-300 shrink-0">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Active Profile: <strong className="text-emerald-400 font-semibold">{activeProfileName}</strong></span>
        </div>
      </div>

      {/* Main Grid: Chat Console + Pending Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Simulated Minecraft Chat (8 cols) */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-[460px] shadow-lg">
          {/* Chat Window Bar */}
          <div className="bg-neutral-900 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated Minecraft Chat Window</span>
            </div>
            <span className="text-[11px] text-neutral-500">Type /macros to open menu</span>
          </div>

          {/* Minecraft Chat History */}
          <div
            ref={chatScrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-xs bg-black/85"
          >
            {chatMessages.map((msg) => {
              const isCmd = msg.text.startsWith('[Command Sent]');
              const isSys = msg.type === 'system';

              return (
                <div
                  key={msg.id}
                  className={`leading-relaxed px-2 py-1 rounded transition-colors ${
                    isCmd
                      ? 'bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500'
                      : isSys
                      ? 'text-amber-300'
                      : 'text-neutral-200'
                  }`}
                >
                  <span className="text-neutral-600 mr-2 text-[10px]">[{msg.timestamp}]</span>
                  <span>{msg.text}</span>
                </div>
              );
            })}
          </div>

          {/* Chat input form */}
          <form
            onSubmit={handleSendChat}
            className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputChat}
              onChange={(e) => setInputChat(e.target.value)}
              placeholder="Type in chat or type /macros..."
              className="flex-1 bg-neutral-950 border border-neutral-700 text-neutral-100 text-xs px-3.5 py-2.5 rounded font-mono focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right Column: Pending Command Queue (4 cols) */}
        <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 rounded-lg p-5 flex flex-col h-[460px] shadow-lg justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-850">
              <div>
                <div className="text-xs font-semibold text-neutral-200">Upcoming Timed Actions</div>
                <div className="text-[11px] text-neutral-400">
                  Commands waiting for their pause time
                </div>
              </div>
              {commandQueue.length > 0 && (
                <button
                  onClick={() => setCommandQueue([])}
                  className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            {/* Queue items */}
            <div className="max-h-[220px] overflow-y-auto py-3 space-y-2.5">
              {commandQueue.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center p-4 text-neutral-500 text-xs font-mono space-y-2">
                  <Clock className="w-7 h-7 opacity-40 text-neutral-600" />
                  <div>No actions queued right now.</div>
                  <div className="text-[11px] text-neutral-500">
                    Trigger any keybind below to see delayed steps countdown in real time!
                  </div>
                </div>
              ) : (
                commandQueue.map((item) => {
                  const ticksLeft = Math.max(0, item.targetTick - currentTicks);
                  const secondsLeft = (ticksLeft / 20).toFixed(1);
                  const totalDelay = Math.max(1, item.targetTick - item.initialTick);
                  const progressPct = Math.min(100, Math.max(0, ((totalDelay - ticksLeft) / totalDelay) * 100));

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-neutral-900 border border-neutral-800 rounded text-xs font-mono space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-bold truncate max-w-[150px]">
                          {item.command}
                        </span>
                        <span className="text-amber-400 font-semibold">
                          {secondsLeft}s remaining
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full transition-all duration-75"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick-Fire Macro Trigger Buttons from Active Profile */}
          <div className="pt-3 border-t border-neutral-850">
            <div className="text-[11px] text-neutral-400 mb-2">
              Click to fire active hotkeys:
            </div>
            <div className="flex flex-wrap gap-2 max-h-[110px] overflow-y-auto">
              {macros.length === 0 ? (
                <div className="text-xs text-neutral-500 italic">No keys bound in this profile.</div>
              ) : (
                macros.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => triggerMacroCommand(m.command)}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 rounded text-xs font-mono text-neutral-200 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                  >
                    <span className="text-emerald-400 font-bold">[{m.keyName}]</span>
                    <Play className="w-2.5 h-2.5 text-neutral-400" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
