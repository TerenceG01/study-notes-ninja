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
      flashcard_decks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          last_used_mode: string | null
          learned_cards: number | null
          tags: string[] | null
          title: string
          total_cards: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          last_used_mode?: string | null
          learned_cards?: number | null
          tags?: string[] | null
          title: string
          total_cards?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          last_used_mode?: string | null
          learned_cards?: number | null
          tags?: string[] | null
          title?: string
          total_cards?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcard_reviews: {
        Row: {
          created_at: string
          flashcard_id: string
          id: string
          is_correct: boolean
          next_review_date: string | null
          review_date: string
        }
        Insert: {
          created_at?: string
          flashcard_id: string
          id?: string
          is_correct: boolean
          next_review_date?: string | null
          review_date?: string
        }
        Update: {
          created_at?: string
          flashcard_id?: string
          id?: string
          is_correct?: boolean
          next_review_date?: string | null
          review_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_reviews_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          answer: string
          created_at: string
          deck_id: string
          difficulty: number | null
          has_multiple_choice_options: boolean | null
          id: string
          last_reviewed: string | null
          learned: boolean | null
          note_id: string | null
          question: string
          tags: string[] | null
          times_reviewed: number | null
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          deck_id: string
          difficulty?: number | null
          has_multiple_choice_options?: boolean | null
          id?: string
          last_reviewed?: string | null
          learned?: boolean | null
          note_id?: string | null
          question: string
          tags?: string[] | null
          times_reviewed?: number | null
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          deck_id?: string
          difficulty?: number | null
          has_multiple_choice_options?: boolean | null
          id?: string
          last_reviewed?: string | null
          learned?: boolean | null
          note_id?: string | null
          question?: string
          tags?: string[] | null
          times_reviewed?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "flashcard_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      multiple_choice_attempts: {
        Row: {
          created_at: string
          flashcard_id: string
          id: string
          is_correct: boolean
          selected_option_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          flashcard_id: string
          id?: string
          is_correct: boolean
          selected_option_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          flashcard_id?: string
          id?: string
          is_correct?: boolean
          selected_option_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "multiple_choice_attempts_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "multiple_choice_attempts_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "multiple_choice_options"
            referencedColumns: ["id"]
          },
        ]
      }
      multiple_choice_options: {
        Row: {
          content: string
          created_at: string
          explanation: string | null
          flashcard_id: string
          id: string
          is_correct: boolean
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          explanation?: string | null
          flashcard_id: string
          id?: string
          is_correct?: boolean
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          explanation?: string | null
          flashcard_id?: string
          id?: string
          is_correct?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "multiple_choice_options_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          folder: string | null
          id: string
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          folder?: string | null
          id?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          folder?: string | null
          id?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          preferred_flashcard_mode: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          preferred_flashcard_mode?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          preferred_flashcard_mode?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      study_group_invites: {
        Row: {
          created_at: string | null
          created_by: string
          email: string | null
          expires_at: string | null
          group_id: string
          id: string
          invite_code: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          email?: string | null
          expires_at?: string | null
          group_id: string
          id?: string
          invite_code?: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          email?: string | null
          expires_at?: string | null
          group_id?: string
          id?: string
          invite_code?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_group_invites_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_group_members: {
        Row: {
          group_id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_group_notes: {
        Row: {
          group_id: string
          id: string
          note_id: string
          shared_at: string | null
          shared_by: string
        }
        Insert: {
          group_id: string
          id?: string
          note_id: string
          shared_at?: string | null
          shared_by: string
        }
        Update: {
          group_id?: string
          id?: string
          note_id?: string
          shared_at?: string | null
          shared_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_group_notes_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_group_notes_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_group_member: {
        Args: {
          p_group_id: string
          p_user_id: string
          p_role: string
        }
        Returns: undefined
      }
      create_study_group: {
        Args: {
          p_name: string
          p_subject: string
          p_description: string
          p_user_id: string
        }
        Returns: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          subject: string
        }
      }
      get_user_study_groups: {
        Args: {
          p_user_id: string
        }
        Returns: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          subject: string
        }[]
      }
      join_group_with_invite: {
        Args: {
          p_invite_code: string
        }
        Returns: string
      }
    }
    Enums: {
      flashcard_mode: "standard"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
