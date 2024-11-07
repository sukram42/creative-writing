export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
            referencedRelation: "chapters"
            referencedColumns: ["chapter_id"]
          },
          {
            foreignKeyName: "public_items_type_fkey"
            columns: ["type"]
            referencedRelation: "item-types-enum"
            referencedColumns: ["id"]
          },
        ]
      }
      items_v2: {
        Row: {
          created_at: string
          final: string | null
          final_version: number
          item_id: string
          last_modification_date: string
          locked: boolean | null
          outline: string | null
          project_id: string | null
          rank: number
          type: Database["public"]["Enums"]["ItemType"] | null
          version: number | null
        }
        Insert: {
          created_at?: string
          final?: string | null
          final_version?: number
          item_id?: string
          last_modification_date?: string
          locked?: boolean | null
          outline?: string | null
          project_id?: string | null
          rank?: number
          type?: Database["public"]["Enums"]["ItemType"] | null
          version?: number | null
        }
        Update: {
          created_at?: string
          final?: string | null
          final_version?: number
          item_id?: string
          last_modification_date?: string
          locked?: boolean | null
          outline?: string | null
          project_id?: string | null
          rank?: number
          type?: Database["public"]["Enums"]["ItemType"] | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_v2_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      items_v2_audit: {
        Row: {
          created_at: string
          final: string | null
          final_version: number
          item_id: string
          last_modification_date: string
          locked: boolean | null
          outline: string | null
          project_id: string | null
          rank: number
          type: Database["public"]["Enums"]["ItemType"] | null
        }
        Insert: {
          created_at?: string
          final?: string | null
          final_version?: number
          item_id?: string
          last_modification_date?: string
          locked?: boolean | null
          outline?: string | null
          project_id?: string | null
          rank?: number
          type?: Database["public"]["Enums"]["ItemType"] | null
        }
        Update: {
          created_at?: string
          final?: string | null
          final_version?: number
          item_id?: string
          last_modification_date?: string
          locked?: boolean | null
          outline?: string | null
          project_id?: string | null
          rank?: number
          type?: Database["public"]["Enums"]["ItemType"] | null
        }
        Relationships: [
          {
            foreignKeyName: "public_items_v2_duplicate_project_id_fkey"
            columns: ["project_id"]
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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
