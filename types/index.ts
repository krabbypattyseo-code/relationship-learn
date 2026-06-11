export type UserId = 'harist' | 'dian';

export type Mode =
  | 'reflect'
  | 'analisis'
  | 'plan'
  | 'conversation'
  | 'growth';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatEntry {
  id: string;
  user_id: UserId;
  mode: Mode;
  title: string | null;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface ModeConfig {
  id: Mode;
  label: string;
  icon: string;
  description: string;
}

export interface ChatWindowProps {
  userId: UserId;
  mode: Mode;
  initialMessages?: Message[];
  onSave?: (messages: Message[]) => void;
}

export interface ModeSelectorProps {
  userId: UserId;
  onSelect: (mode: Mode) => void;
}

export interface GrowthDashboardProps {
  userId: UserId;
  entries: ChatEntry[];
}

export interface EntryCardProps {
  entry: ChatEntry;
  onClick?: () => void;
}
