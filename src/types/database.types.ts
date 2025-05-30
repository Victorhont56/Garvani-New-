export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]


// Add this before your existing Database type
declare global {
  interface Database {
    public: {
      Tables: {
        user_roles: {
          Row: {
            id: string
            user_id: string
            is_admin: boolean
            created_at: string | null
          }
          Insert: {
            id?: string
            user_id: string
            is_admin?: boolean
            created_at?: string | null
          }
          Update: {
            id?: string
            user_id?: string
            is_admin?: boolean
            created_at?: string | null
          }
          Relationships: []
        }
      }
    }
  }
}

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          home_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          home_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          home_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      homes: {
        Row: {
          added_category: boolean | null
          added_description: boolean | null
          address: string | null
          bathrooms: string | null
          bedrooms: string | null
          category_name: string | null
          created_at: string | null
          description: string
          features: string[] | null
          id: string
          images: string[] | null
          lga: string
          livingrooms: string | null
          mode: string
          photo: string | null
          price: number | null
          rejection_reason: string | null
          reviewed_by: string | null
          size: number | null
          state: string
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
          "year-built": number | null
        }
        Insert: {
          added_category?: boolean | null
          added_description?: boolean | null
          address?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          category_name?: string | null
          created_at?: string | null
          description: string
          features?: string[] | null
          id?: string
          images?: string[] | null
          lga: string
          livingrooms?: string | null
          mode: string
          photo?: string | null
          price?: number | null
          rejection_reason?: string | null
          reviewed_by?: string | null
          size?: number | null
          state: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
          "year-built"?: number | null
        }
        Update: {
          added_category?: boolean | null
          added_description?: boolean | null
          address?: string | null
          bathrooms?: string | null
          bedrooms?: string | null
          category_name?: string | null
          created_at?: string | null
          description?: string
          features?: string[] | null
          id?: string
          images?: string[] | null
          lga?: string
          livingrooms?: string | null
          mode?: string
          photo?: string | null
          price?: number | null
          rejection_reason?: string | null
          reviewed_by?: string | null
          size?: number | null
          state?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
          "year-built"?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          home_id: string
          id: string
          payment_date: string | null
          user_id: string
        }
        Insert: {
          amount: number
          home_id: string
          id?: string
          payment_date?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          home_id?: string
          id?: string
          payment_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string | null
          end_date: string
          home_id: string
          id: string
          start_date: string
          status: string | null
          total_price: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          home_id: string
          id?: string
          start_date: string
          status?: string | null
          total_price: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          home_id?: string
          id?: string
          start_date?: string
          status?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          home_id: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          home_id: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          home_id?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_home_id_fkey"
            columns: ["home_id"]
            isOneToOne: false
            referencedRelation: "homes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_with_roles: {
        Row: {
          id: string;
          email: string | null;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          updated_at: string | null;
          created_at: string;
          is_admin: boolean;
          role_created_at: string | null;
        };
      };
    };
    Functions: {
      add_avatar_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_owner: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
