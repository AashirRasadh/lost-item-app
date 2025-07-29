import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      lost_items: {
        Row: {
          id: string
          title: string
          description: string
          last_seen_location: string
          date_lost: string
          image_url: string | null
          author_id: string
          author_email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          last_seen_location: string
          date_lost: string
          image_url?: string | null
          author_id: string
          author_email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          last_seen_location?: string
          date_lost?: string
          image_url?: string | null
          author_id?: string
          author_email?: string
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          author_email: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          author_email: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          author_email?: string
          content?: string
          created_at?: string
        }
      }
    }
  }
}
