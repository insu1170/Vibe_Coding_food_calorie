export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      food_logs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          meal_type: '아침' | '점심' | '저녁' | '간식'
          items: Json
          summary: Json
          image_url?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          meal_type: '아침' | '점심' | '저녁' | '간식'
          items: Json
          summary: Json
          image_url?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          meal_type?: '아침' | '점심' | '저녁' | '간식'
          items?: Json
          summary?: Json
          image_url?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
