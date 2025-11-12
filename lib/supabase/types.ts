export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'owner' | 'admin' | 'editor' | 'viewer'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          avatar_url?: string | null
          created_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          primary_color: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          primary_color: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          primary_color?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          user_id: string
          brand_id: string
          role: 'owner' | 'admin' | 'editor' | 'viewer'
          permissions: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_id: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          permissions?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_id?: string
          role?: 'owner' | 'admin' | 'editor' | 'viewer'
          permissions?: string[]
          created_at?: string
        }
      }
      social_accounts: {
        Row: {
          id: string
          user_id: string
          brand_id: string
          platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'snapchat'
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          username: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_id: string
          platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'snapchat'
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          username?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_id?: string
          platform?: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'snapchat'
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          username?: string | null
          created_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          brand_id: string
          user_id: string
          filename: string
          r2_path: string
          cdn_url: string
          file_type: 'image' | 'video' | 'document'
          file_size: number
          dimensions: { width: number; height: number } | null
          tags: string[]
          alt_text: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          user_id: string
          filename: string
          r2_path: string
          cdn_url: string
          file_type: 'image' | 'video' | 'document'
          file_size: number
          dimensions?: { width: number; height: number } | null
          tags?: string[]
          alt_text?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          user_id?: string
          filename?: string
          r2_path?: string
          cdn_url?: string
          file_type?: 'image' | 'video' | 'document'
          file_size?: number
          dimensions?: { width: number; height: number } | null
          tags?: string[]
          alt_text?: string | null
          uploaded_at?: string
        }
      }
      scheduled_posts: {
        Row: {
          id: string
          brand_id: string
          user_id: string
          content: string
          platforms: ('instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'snapchat')[]
          assets: string[]
          scheduled_for: string
          status: 'draft' | 'scheduled' | 'posted' | 'failed'
          posted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          user_id: string
          content: string
          platforms: ('instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'snapchat')[]
          assets: string[]
          scheduled_for: string
          status?: 'draft' | 'scheduled' | 'posted' | 'failed'
          posted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          user_id?: string
          content?: string
          platforms?: ('instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'youtube' | 'snapchat')[]
          assets?: string[]
          scheduled_for?: string
          status?: 'draft' | 'scheduled' | 'posted' | 'failed'
          posted_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Brand = Database['public']['Tables']['brands']['Row']
export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type SocialAccount = Database['public']['Tables']['social_accounts']['Row']
export type Asset = Database['public']['Tables']['assets']['Row']
export type ScheduledPost = Database['public']['Tables']['scheduled_posts']['Row']

