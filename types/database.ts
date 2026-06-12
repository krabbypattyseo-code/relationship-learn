export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chat_entries: {
        Row: {
          id: string;
          user_id: string;
          mode: string;
          title: string | null;
          messages: Json;
          score_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mode: string;
          title?: string | null;
          messages: Json;
          score_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mode?: string;
          title?: string | null;
          messages?: Json;
          score_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          user_id: string;
          pin: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          pin: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          pin?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      growth_scores: {
        Row: {
          id: string;
          user_id: string;
          period_start: string;
          period_end: string;
          oxytocin_score: number;
          dopamine_score: number;
          serotonin_score: number;
          cortisol_score: number;
          er_self_awareness: number | null;
          er_self_regulation: number | null;
          er_empathy: number | null;
          er_social_skill: number | null;
          er_composite: number | null;
          er_generated_at: string | null;
          entries_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          period_start: string;
          period_end: string;
          oxytocin_score: number;
          dopamine_score: number;
          serotonin_score: number;
          cortisol_score: number;
          er_self_awareness?: number | null;
          er_self_regulation?: number | null;
          er_empathy?: number | null;
          er_social_skill?: number | null;
          er_composite?: number | null;
          er_generated_at?: string | null;
          entries_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          period_start?: string;
          period_end?: string;
          oxytocin_score?: number;
          dopamine_score?: number;
          serotonin_score?: number;
          cortisol_score?: number;
          er_self_awareness?: number | null;
          er_self_regulation?: number | null;
          er_empathy?: number | null;
          er_social_skill?: number | null;
          er_composite?: number | null;
          er_generated_at?: string | null;
          entries_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
