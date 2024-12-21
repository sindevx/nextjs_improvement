// types/supabase.ts
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
            posts: {
                Row: {
                    id: number
                    title: string
                    content: string
                    created_at: string
                    image_url: string | null
                    user_id: string
                }
                Insert: {
                    id?: number
                    title: string
                    content: string
                    created_at?: string
                    image_url?: string | null
                    user_id: string
                }
            }
            comments: {
                Row: {
                    id: string
                    content: string
                    created_at: string
                    user_id: string
                    post_id: number
                }
                Insert: {
                    id?: string
                    content: string
                    created_at?: string
                    user_id: string
                    post_id: number
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
    }
}