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
      profiles: {
        Row: {
          id: string
          role: Database['public']['Enums']['user_role']
          full_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          account_status: Database['public']['Enums']['account_status']
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: Database['public']['Enums']['user_role']
          full_name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          account_status?: Database['public']['Enums']['account_status']
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: Database['public']['Enums']['user_role']
          full_name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          account_status?: Database['public']['Enums']['account_status']
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      umkm_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_category: string | null
          business_description: string | null
          owner_name: string | null
          location: string | null
          city: string | null
          province: string | null
          instagram_url: string | null
          tiktok_url: string | null
          whatsapp_number: string | null
          logo_url: string | null
          target_audience: string | null
          content_preference: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_category?: string | null
          business_description?: string | null
          owner_name?: string | null
          location?: string | null
          city?: string | null
          province?: string | null
          instagram_url?: string | null
          tiktok_url?: string | null
          whatsapp_number?: string | null
          logo_url?: string | null
          target_audience?: string | null
          content_preference?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_category?: string | null
          business_description?: string | null
          owner_name?: string | null
          location?: string | null
          city?: string | null
          province?: string | null
          instagram_url?: string | null
          tiktok_url?: string | null
          whatsapp_number?: string | null
          logo_url?: string | null
          target_audience?: string | null
          content_preference?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "umkm_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      creator_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          bio: string | null
          location: string | null
          city: string | null
          province: string | null
          niche: string | null
          skills: string[] | null
          instagram_url: string | null
          tiktok_url: string | null
          youtube_url: string | null
          portfolio_url: string | null
          banner_url: string | null
          avatar_url: string | null
          availability_status: Database['public']['Enums']['creator_availability_status']
          starting_price: number | null
          average_rating: number | null
          completed_orders_count: number
          response_time_hours: number | null
          is_verified: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          bio?: string | null
          location?: string | null
          city?: string | null
          province?: string | null
          niche?: string | null
          skills?: string[] | null
          instagram_url?: string | null
          tiktok_url?: string | null
          youtube_url?: string | null
          portfolio_url?: string | null
          banner_url?: string | null
          avatar_url?: string | null
          availability_status?: Database['public']['Enums']['creator_availability_status']
          starting_price?: number | null
          average_rating?: number | null
          completed_orders_count?: number
          response_time_hours?: number | null
          is_verified?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          bio?: string | null
          location?: string | null
          city?: string | null
          province?: string | null
          niche?: string | null
          skills?: string[] | null
          instagram_url?: string | null
          tiktok_url?: string | null
          youtube_url?: string | null
          portfolio_url?: string | null
          banner_url?: string | null
          avatar_url?: string | null
          availability_status?: Database['public']['Enums']['creator_availability_status']
          starting_price?: number | null
          average_rating?: number | null
          completed_orders_count?: number
          response_time_hours?: number | null
          is_verified?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      service_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_name: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon_name?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon_name?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_packages: {
        Row: {
          id: string
          creator_id: string
          category_id: string | null
          title: string
          slug: string
          short_description: string | null
          description: string | null
          cover_image_url: string | null
          base_price: number
          estimated_days: number
          revision_count: number
          deliverables: string[] | null
          requirements: string[] | null
          tags: string[] | null
          is_active: boolean
          is_featured: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          category_id?: string | null
          title: string
          slug: string
          short_description?: string | null
          description?: string | null
          cover_image_url?: string | null
          base_price?: number
          estimated_days?: number
          revision_count?: number
          deliverables?: string[] | null
          requirements?: string[] | null
          tags?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          category_id?: string | null
          title?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          cover_image_url?: string | null
          base_price?: number
          estimated_days?: number
          revision_count?: number
          deliverables?: string[] | null
          requirements?: string[] | null
          tags?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_packages_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_packages_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_number: string
          umkm_id: string
          creator_id: string
          campaign_brief_id: string | null
          order_status: Database['public']['Enums']['order_status']
          payment_status: Database['public']['Enums']['payment_status']
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          umkm_id: string
          creator_id: string
          campaign_brief_id?: string | null
          order_status?: Database['public']['Enums']['order_status']
          payment_status?: Database['public']['Enums']['payment_status']
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          umkm_id?: string
          creator_id?: string
          campaign_brief_id?: string | null
          order_status?: Database['public']['Enums']['order_status']
          payment_status?: Database['public']['Enums']['payment_status']
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_umkm_id_fkey"
            columns: ["umkm_id"]
            referencedRelation: "umkm_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'umkm' | 'creator'
      account_status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
      creator_availability_status: 'available' | 'limited' | 'busy' | 'unavailable'
      order_status: 'draft' | 'awaiting_payment' | 'paid' | 'waiting_creator_confirmation' | 'brief_accepted' | 'in_progress' | 'submitted' | 'revision_requested' | 'revised' | 'completed' | 'cancelled' | 'refunded'
      payment_status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded' | 'partially_refunded'
      payment_method: 'bank_transfer' | 'qris' | 'ewallet' | 'virtual_account' | 'manual'
      revision_status: 'requested' | 'in_progress' | 'submitted' | 'approved' | 'rejected'
      complaint_status: 'open' | 'under_review' | 'waiting_umkm' | 'waiting_creator' | 'resolved' | 'rejected'
      notification_type: 'order' | 'payment' | 'revision' | 'submission' | 'review' | 'complaint' | 'system'
    }
  }
}
