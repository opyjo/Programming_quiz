import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type QuestionCategory =
  | "HTML"
  | "CSS"
  | "JavaScript"
  | "React"
  | "TypeScript"
  | "Accessibility"
  | "Performance"
  | "Security"
  | "General";

export interface Question {
  id: string;
  category: QuestionCategory;
  question_text: string;
  answer_text: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
}
