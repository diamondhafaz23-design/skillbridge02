export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          category: string
          completed_at: string
          id: string
          questions_answered: Json
          results: Json
          score: number
          user_id: string
        }
        Insert: {
          category?: string
          completed_at?: string
          id?: string
          questions_answered?: Json
          results?: Json
          score?: number
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string
          id?: string
          questions_answered?: Json
          results?: Json
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mentors: {
        Row: {
          experience_years: number
          expertise: string[]
          id: string
          is_sample: boolean
          languages: string[]
          name: string
          profession: string
          professional_industry: string
          sample_key: string | null
          short_biography: string
          skills: string[]
          story: string
        }
        Insert: {
          experience_years?: number
          expertise?: string[]
          id?: string
          is_sample?: boolean
          languages?: string[]
          name: string
          profession?: string
          professional_industry: string
          sample_key?: string | null
          short_biography?: string
          skills?: string[]
          story?: string
        }
        Update: {
          experience_years?: number
          expertise?: string[]
          id?: string
          is_sample?: boolean
          languages?: string[]
          name?: string
          profession?: string
          professional_industry?: string
          sample_key?: string | null
          short_biography?: string
          skills?: string[]
          story?: string
        }
        Relationships: []
      }
      mentorship_requests: {
        Row: {
          contact_email: string
          created_at: string
          id: string
          mentor_id: string
          message: string
          preferred_language: string
          requester_name: string
          status: string
          user_id: string
        }
        Insert: {
          contact_email: string
          created_at?: string
          id?: string
          mentor_id: string
          message: string
          preferred_language: string
          requester_name: string
          status?: string
          user_id: string
        }
        Update: {
          contact_email?: string
          created_at?: string
          id?: string
          mentor_id?: string
          message?: string
          preferred_language?: string
          requester_name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      opportunities: {
        Row: {
          credential_flexible: boolean
          description: string
          employer: string
          employment_type: string
          experience_requirements: string
          id: string
          is_sample: boolean
          job_title: string
          languages: string[]
          location: string
          required_skills: string[]
          sample_key: string | null
        }
        Insert: {
          credential_flexible?: boolean
          description?: string
          employer: string
          employment_type?: string
          experience_requirements?: string
          id?: string
          is_sample?: boolean
          job_title: string
          languages?: string[]
          location?: string
          required_skills?: string[]
          sample_key?: string | null
        }
        Update: {
          credential_flexible?: boolean
          description?: string
          employer?: string
          employment_type?: string
          experience_requirements?: string
          id?: string
          is_sample?: boolean
          job_title?: string
          languages?: string[]
          location?: string
          required_skills?: string[]
          sample_key?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          education: string
          full_name: string
          languages: string[]
          location: string
          professional_summary: string
          professional_title: string
          updated_at: string
          user_id: string
          work_experience: string
          years_experience: number
        }
        Insert: {
          created_at?: string
          education?: string
          full_name?: string
          languages?: string[]
          location?: string
          professional_summary?: string
          professional_title?: string
          updated_at?: string
          user_id: string
          work_experience?: string
          years_experience?: number
        }
        Update: {
          created_at?: string
          education?: string
          full_name?: string
          languages?: string[]
          location?: string
          professional_summary?: string
          professional_title?: string
          updated_at?: string
          user_id?: string
          work_experience?: string
          years_experience?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          assessment_id: string | null
          id: string
          origin: string
          skill_name: string
          source: string
          user_id: string
        }
        Insert: {
          assessment_id?: string | null
          id?: string
          origin: string
          skill_name: string
          source: string
          user_id: string
        }
        Update: {
          assessment_id?: string | null
          id?: string
          origin?: string
          skill_name?: string
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      save_skillbridge_assessment: {
        Args: { p_answers: Json; p_experience: Json }
        Returns: string
      }
      save_skillbridge_profile: {
        Args: { p_profile: Json; p_skills: string[] }
        Returns: undefined
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
