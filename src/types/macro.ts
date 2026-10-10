export interface MacroItem {
  id: string;
  keyCode: number; // LWJGL key code (e.g. 19 for R, 46 for C, etc.)
  keyName: string;
  command: string; // May contain " ;; " and "delay:X"
}

export interface ProfileData {
  name: string;
  macros: MacroItem[];
}

export interface PendingCommand {
  id: string;
  command: string;
  targetTick: number;
  initialTick: number;
  progress: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  type: 'player' | 'system' | 'macro';
}
