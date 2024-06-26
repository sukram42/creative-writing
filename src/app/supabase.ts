export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chapters: {
        Row: {
          chapter_id: string
          created_at: string
          descriptions: string | null
          index: number | null
          project: string | null
          title: string | null
        }
        Insert: {
          chapter_id?: string
          created_at?: string
          descriptions?: string | null
          index?: number | null
          project?: string | null
          title?: string | null
        }
        Update: {
          chapter_id?: string
          created_at?: string
          descriptions?: string | null
          index?: number | null
          project?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      "item-types-enum": {
        Row: {
          id: number
          type: string | null
        }
        Insert: {
          id?: number
          type?: string | null
        }
        Update: {
          id?: number
          type?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          chapter: string
          created_at: string
          final: string | null
          item_id: string
          outline: string | null
          rank_in_chapter: number
          type: number | null
        }
        Insert: {
          chapter: string
          created_at?: string
          final?: string | null
          item_id?: string
          outline?: string | null
          rank_in_chapter?: number
          type?: number | null
        }
        Update: {
          chapter?: string
          created_at?: string
          final?: string | null
          item_id?: string
          outline?: string | null
          rank_in_chapter?: number
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_chapter_fkey"
            columns: ["chapter"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["chapter_id"]
          },
          {
            foreignKeyName: "public_items_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "item-types-enum"
            referencedColumns: ["id"]
          },
        ]
      }
      items_v2: {
        Row: {
          created_at: string
          final: string | null
          item_id: string
          locked: boolean
          outline: string | null
          project_id: string | null
          rank: number
          type: Database["public"]["Enums"]["ItemType"] | null
          version: number
        }
        Insert: {
          created_at?: string
          final?: string | null
          item_id?: string
          locked?: boolean
          outline?: string | null
          project_id?: string | null
          rank?: number
          type?: Database["public"]["Enums"]["ItemType"] | null
          version?: number
        }
        Update: {
          created_at?: string
          final?: string | null
          item_id?: string
          locked?: boolean
          outline?: string | null
          project_id?: string | null
          rank?: number
          type?: Database["public"]["Enums"]["ItemType"] | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "items_v2_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      profiles: {
        Row: {
          is_onboarded: boolean
          password_set: boolean
          user_id: string
        }
        Insert: {
          is_onboarded?: boolean
          password_set?: boolean
          user_id?: string
        }
        Update: {
          is_onboarded?: boolean
          password_set?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          language_description: string | null
          name: string
          output_language: string | null
          paragraph_definition: string | null
          project_id: string
          target_group: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          language_description?: string | null
          name: string
          output_language?: string | null
          paragraph_definition?: string | null
          project_id?: string
          target_group?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          language_description?: string | null
          name?: string
          output_language?: string | null
          paragraph_definition?: string | null
          project_id?: string
          target_group?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_projects_createdBy_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          id: string
          model_name: string
          prompt: string
          temperature: number
        }
        Insert: {
          id: string
          model_name?: string
          prompt: string
          temperature?: number
        }
        Update: {
          id?: string
          model_name?: string
          prompt?: string
          temperature?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrementitemindex: {
        Args: {
          minrank: number
          chapter_id: string
        }
        Returns: undefined
      }
      increment_rank_of_items: {
        Args: {
          minrank: number
          project: string
        }
        Returns: undefined
      }
      incrementchapterindex: {
        Args: {
          minrank: number
          project_id: string
        }
        Returns: undefined
      }
      incrementitemindex: {
        Args: {
          minrank: number
          chapter_id: string
        }
        Returns: undefined
      }
      insert_user_on_registration: {
        Args: {
          new_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      ItemType: "PARAGRAPH" | "H1"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
