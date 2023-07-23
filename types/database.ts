export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      mails: {
        Row: {
          content: Json | null;
          created_at: string | null;
          id: number;
          title: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          content?: Json | null;
          created_at?: string | null;
          id?: number;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: Json | null;
          created_at?: string | null;
          id?: number;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'mails_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
