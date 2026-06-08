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
      service_package_tiers: {
        Row: {
          id: string
          service_package_id: string
          name: string
          description: string | null
          price: number
          estimated_days: number
          revision_count: number
          deliverables: string[] | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_package_id: string
          name: string
          description?: string | null
          price: number
          estimated_days: number
          revision_count?: number
          deliverables?: string[] | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_package_id?: string
          name?: string
          description?: string | null
          price?: number
          estimated_days?: number
          revision_count?: number
          deliverables?: string[] | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_package_tiers_service_package_id_fkey"
            columns: ["service_package_id"]
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          }
        ]
      }
      service_addons: {
        Row: {
          id: string
          service_package_id: string
          name: string
          description: string | null
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_package_id: string
          name: string
          description?: string | null
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_package_id?: string
          name?: string
          description?: string | null
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_addons_service_package_id_fkey"
            columns: ["service_package_id"]
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          }
        ]
      }
      portfolios: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string | null
          category_id: string | null
          thumbnail_url: string | null
          media_url: string | null
          external_url: string | null
          client_type: string | null
          is_featured: boolean
          sort_order: number
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          description?: string | null
          category_id?: string | null
          thumbnail_url?: string | null
          media_url?: string | null
          external_url?: string | null
          client_type?: string | null
          is_featured?: boolean
          sort_order?: number
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          description?: string | null
          category_id?: string | null
          thumbnail_url?: string | null
          media_url?: string | null
          external_url?: string | null
          client_type?: string | null
          is_featured?: boolean
          sort_order?: number
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolios_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      carts: {
        Row: {
          id: string
          umkm_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          umkm_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          umkm_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carts_umkm_id_fkey"
            columns: ["umkm_id"]
            referencedRelation: "umkm_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          service_package_id: string
          tier_id: string | null
          creator_id: string
          quantity: number
          unit_price: number
          addon_total: number
          subtotal: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          service_package_id: string
          tier_id?: string | null
          creator_id: string
          quantity?: number
          unit_price: number
          addon_total?: number
          subtotal: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          service_package_id?: string
          tier_id?: string | null
          creator_id?: string
          quantity?: number
          unit_price?: number
          addon_total?: number
          subtotal?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_service_package_id_fkey"
            columns: ["service_package_id"]
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_tier_id_fkey"
            columns: ["tier_id"]
            referencedRelation: "service_package_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_item_addons: {
        Row: {
          id: string
          cart_item_id: string
          addon_id: string
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          cart_item_id: string
          addon_id: string
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          cart_item_id?: string
          addon_id?: string
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_item_addons_cart_item_id_fkey"
            columns: ["cart_item_id"]
            referencedRelation: "cart_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_item_addons_addon_id_fkey"
            columns: ["addon_id"]
            referencedRelation: "service_addons"
            referencedColumns: ["id"]
          }
        ]
      }
      campaign_briefs: {
        Row: {
          id: string
          umkm_id: string
          order_id: string | null
          business_name: string
          business_category: string | null
          promoted_product: string
          campaign_goal: string
          target_audience: string | null
          content_platforms: string[] | null
          content_style: string | null
          reference_links: string[] | null
          deadline: string | null
          additional_notes: string | null
          asset_urls: string[] | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          umkm_id: string
          order_id?: string | null
          business_name: string
          business_category?: string | null
          promoted_product: string
          campaign_goal: string
          target_audience?: string | null
          content_platforms?: string[] | null
          content_style?: string | null
          reference_links?: string[] | null
          deadline?: string | null
          additional_notes?: string | null
          asset_urls?: string[] | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          umkm_id?: string
          order_id?: string | null
          business_name?: string
          business_category?: string | null
          promoted_product?: string
          campaign_goal?: string
          target_audience?: string | null
          content_platforms?: string[] | null
          content_style?: string | null
          reference_links?: string[] | null
          deadline?: string | null
          additional_notes?: string | null
          asset_urls?: string[] | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_briefs_umkm_id_fkey"
            columns: ["umkm_id"]
            referencedRelation: "umkm_profiles"
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
          subtotal_amount: number
          addon_amount: number
          admin_fee: number
          platform_fee: number
          discount_amount: number
          total_amount: number
          deadline: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
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
          subtotal_amount?: number
          addon_amount?: number
          admin_fee?: number
          platform_fee?: number
          discount_amount?: number
          total_amount?: number
          deadline?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
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
          subtotal_amount?: number
          addon_amount?: number
          admin_fee?: number
          platform_fee?: number
          discount_amount?: number
          total_amount?: number
          deadline?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
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
      order_items: {
        Row: {
          id: string
          order_id: string
          service_package_id: string | null
          tier_id: string | null
          service_title: string
          tier_name: string | null
          unit_price: number
          addon_total: number
          subtotal: number
          estimated_days: number | null
          revision_count: number | null
          deliverables: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          service_package_id?: string | null
          tier_id?: string | null
          service_title: string
          tier_name?: string | null
          unit_price: number
          addon_total?: number
          subtotal: number
          estimated_days?: number | null
          revision_count?: number | null
          deliverables?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          service_package_id?: string | null
          tier_id?: string | null
          service_title?: string
          tier_name?: string | null
          unit_price?: number
          addon_total?: number
          subtotal?: number
          estimated_days?: number | null
          revision_count?: number | null
          deliverables?: string[] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_service_package_id_fkey"
            columns: ["service_package_id"]
            referencedRelation: "service_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_tier_id_fkey"
            columns: ["tier_id"]
            referencedRelation: "service_package_tiers"
            referencedColumns: ["id"]
          }
        ]
      }
      order_item_addons: {
        Row: {
          id: string
          order_item_id: string
          addon_name: string
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_item_id: string
          addon_name: string
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_item_id?: string
          addon_name?: string
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_addons_order_item_id_fkey"
            columns: ["order_item_id"]
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          order_id: string
          payment_number: string
          payment_status: Database['public']['Enums']['payment_status']
          payment_method: Database['public']['Enums']['payment_method'] | null
          amount: number
          provider: string | null
          provider_transaction_id: string | null
          provider_payment_url: string | null
          paid_at: string | null
          expired_at: string | null
          raw_response: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          payment_number: string
          payment_status?: Database['public']['Enums']['payment_status']
          payment_method?: Database['public']['Enums']['payment_method'] | null
          amount: number
          provider?: string | null
          provider_transaction_id?: string | null
          provider_payment_url?: string | null
          paid_at?: string | null
          expired_at?: string | null
          raw_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          payment_number?: string
          payment_status?: Database['public']['Enums']['payment_status']
          payment_method?: Database['public']['Enums']['payment_method'] | null
          amount?: number
          provider?: string | null
          provider_transaction_id?: string | null
          provider_payment_url?: string | null
          paid_at?: string | null
          expired_at?: string | null
          raw_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          order_id: string
          payment_id: string | null
          invoice_number: string
          subtotal_amount: number
          addon_amount: number
          admin_fee: number
          platform_fee: number
          discount_amount: number
          total_amount: number
          issued_at: string
          paid_at: string | null
          invoice_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          payment_id?: string | null
          invoice_number: string
          subtotal_amount: number
          addon_amount?: number
          admin_fee?: number
          platform_fee?: number
          discount_amount?: number
          total_amount: number
          issued_at?: string
          paid_at?: string | null
          invoice_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          payment_id?: string | null
          invoice_number?: string
          subtotal_amount?: number
          addon_amount?: number
          admin_fee?: number
          platform_fee?: number
          discount_amount?: number
          total_amount?: number
          issued_at?: string
          paid_at?: string | null
          invoice_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            referencedRelation: "payments"
            referencedColumns: ["id"]
          }
        ]
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          previous_status: Database['public']['Enums']['order_status'] | null
          new_status: Database['public']['Enums']['order_status']
          changed_by: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          previous_status?: Database['public']['Enums']['order_status'] | null
          new_status: Database['public']['Enums']['order_status']
          changed_by?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          previous_status?: Database['public']['Enums']['order_status'] | null
          new_status?: Database['public']['Enums']['order_status']
          changed_by?: string | null
          note?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          umkm_id: string
          creator_id: string
          rating: number
          quality_rating: number | null
          communication_rating: number | null
          timeliness_rating: number | null
          comment: string | null
          is_visible: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          umkm_id: string
          creator_id: string
          rating: number
          quality_rating?: number | null
          communication_rating?: number | null
          timeliness_rating?: number | null
          comment?: string | null
          is_visible?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          umkm_id?: string
          creator_id?: string
          rating?: number
          quality_rating?: number | null
          communication_rating?: number | null
          timeliness_rating?: number | null
          comment?: string | null
          is_visible?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_umkm_id_fkey"
            columns: ["umkm_id"]
            referencedRelation: "umkm_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      complaints: {
        Row: {
          id: string
          order_id: string
          opened_by: string
          assigned_admin_id: string | null
          complaint_status: Database['public']['Enums']['complaint_status']
          subject: string
          description: string
          resolution_note: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          opened_by: string
          assigned_admin_id?: string | null
          complaint_status?: Database['public']['Enums']['complaint_status']
          subject: string
          description: string
          resolution_note?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          opened_by?: string
          assigned_admin_id?: string | null
          complaint_status?: Database['public']['Enums']['complaint_status']
          subject?: string
          description?: string
          resolution_note?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_opened_by_fkey"
            columns: ["opened_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_assigned_admin_id_fkey"
            columns: ["assigned_admin_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          notification_type: Database['public']['Enums']['notification_type']
          title: string
          message: string | null
          action_url: string | null
          is_read: boolean
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notification_type?: Database['public']['Enums']['notification_type']
          title: string
          message?: string | null
          action_url?: string | null
          is_read?: boolean
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notification_type?: Database['public']['Enums']['notification_type']
          title?: string
          message?: string | null
          action_url?: string | null
          is_read?: boolean
          deleted_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_order_from_current_cart: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      mark_dummy_payment_as_paid: {
        Args: {
          target_payment_id: string
        }
        Returns: string
      }
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
