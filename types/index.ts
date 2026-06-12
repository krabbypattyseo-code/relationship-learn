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
  score_data?: ModeScoreData | null;
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
  onSave?: (messages: Message[], scoreData?: ModeScoreData | null) => void | Promise<void>;
}

export interface ReflectScore {
  oxytocin: number;
  serotonin: number;
  signals?: string[];
}

export interface AnalisisScore {
  cortisol: number;
  self_regulation: number;
  resolution_rate: number;
  signals?: string[];
}

export interface PlanScore {
  dopamine: number;
  social_skill: number;
  effectiveness: 'executed' | 'unknown' | 'pending';
  signals?: string[];
}

export interface ConversationScore {
  oxytocin: number;
  self_regulation: number;
  empathy: number;
  readiness: number;
  signals?: string[];
}

export interface GrowthSessionScore {
  self_awareness: number;
  self_regulation: number;
  empathy: number;
  social_skill: number;
  narrative?: string;
  focus_next?: string;
}

export type ModeScoreData =
  | ReflectScore
  | AnalisisScore
  | PlanScore
  | ConversationScore
  | GrowthSessionScore;

export interface ScoreDelta {
  dimension: string;
  historical: number;
  session: number;
  delta: number;
  trend: 'up' | 'down' | 'same';
}

export interface ModeHistoricalResponse {
  userId: UserId;
  mode: Mode;
  historicalAvg: ModeScoreData | null;
  lastSession: ModeScoreData | null;
  trend: 'improving' | 'stable' | 'declining';
  sessionCount: number;
}

export interface ModeSelectorProps {
  userId: UserId;
  onSelect: (mode: Mode) => void;
}

export interface GrowthDashboardProps {
  entries: ChatEntry[];
  snapshot: GrowthScoreSnapshot;
  userId?: UserId;
  /** private = stats + activity chart; shared = stats only (no history) */
  variant?: 'private' | 'shared';
}

export interface HormoneScore {
  oxytocin: number;
  dopamine: number;
  serotonin: number;
  cortisol: number;
}

export interface ERScoreRaw {
  self_awareness: number;
  self_regulation: number;
  empathy: number;
  social_skill: number;
  rationale: string;
}

export interface ERScore extends ERScoreRaw {
  composite: number;
}

export interface GrowthScoreSnapshot {
  userId: UserId;
  periodStart: string;
  periodEnd: string;
  hormone: HormoneScore;
  er: ERScore | null;
  entriesCount: number;
  createdAt: string;
  lastUpdated: string;
}

export interface EntryCardProps {
  entry: ChatEntry;
  onClick?: () => void;
}
