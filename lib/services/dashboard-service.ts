import { createClient } from "@/lib/supabase/client";
import { QuestionCategory } from "@/utils/supabase";

export interface UserProgress {
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
}

export interface CategoryProgress {
  category: QuestionCategory;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
}

export interface StudySession {
  id: string;
  category: QuestionCategory | null;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number | null;
}

export interface UserGoal {
  id: string;
  category: QuestionCategory | null;
  goalType: "questions_per_day" | "study_time_per_week";
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate: Date | null;
  completed: boolean;
}

class DashboardService {
  private supabase = createClient();

  async initializeUserProgress(): Promise<void> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return;

    // Check if user progress exists
    const { data: existingProgress } = await this.supabase
      .from("user_progress")
      .select("id")
      .eq("user_id", user.data.user.id)
      .single();

    // If no progress exists, create it
    if (!existingProgress) {
      const { error } = await this.supabase.from("user_progress").insert([
        {
          user_id: user.data.user.id,
          total_questions_attempted: 0,
          total_correct_answers: 0,
          current_streak_days: 0,
          longest_streak_days: 0,
        },
      ]);

      if (error) {
        console.error("Error initializing user progress:", error);
      }
    }
  }

  async getUserProgress(): Promise<UserProgress | null> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return null;

    // Initialize progress if it doesn't exist
    await this.initializeUserProgress();

    const { data, error } = await this.supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.data.user.id)
      .single();

    if (error) {
      console.error("Error fetching user progress:", error);
      return null;
    }

    return data
      ? {
          totalQuestionsAttempted: data.total_questions_attempted,
          totalCorrectAnswers: data.total_correct_answers,
          currentStreak: data.current_streak_days,
          longestStreak: data.longest_streak_days,
          lastActivityDate: data.last_activity_date
            ? new Date(data.last_activity_date)
            : null,
        }
      : null;
  }

  async getCategoryProgress(): Promise<CategoryProgress[]> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return [];

    const { data, error } = await this.supabase
      .from("category_progress")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching category progress:", error);
      return [];
    }

    return data.map((item) => ({
      category: item.category as QuestionCategory,
      questionsAttempted: item.questions_attempted,
      correctAnswers: item.correct_answers,
      accuracy:
        item.questions_attempted > 0
          ? (item.correct_answers / item.questions_attempted) * 100
          : 0,
    }));
  }

  async getStudySessions(limit: number = 10): Promise<StudySession[]> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return [];

    const { data, error } = await this.supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("start_time", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching study sessions:", error);
      return [];
    }

    return data.map((session) => ({
      id: session.id,
      category: session.category as QuestionCategory | null,
      startTime: new Date(session.start_time),
      endTime: session.end_time ? new Date(session.end_time) : null,
      durationMinutes: session.duration_minutes,
    }));
  }

  async getUserGoals(): Promise<UserGoal[]> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return [];

    const { data, error } = await this.supabase
      .from("user_goals")
      .select("*")
      .eq("user_id", user.data.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user goals:", error);
      return [];
    }

    return data.map((goal) => ({
      id: goal.id,
      category: goal.category as QuestionCategory | null,
      goalType: goal.goal_type as "questions_per_day" | "study_time_per_week",
      targetValue: goal.target_value,
      currentValue: goal.current_value,
      startDate: new Date(goal.start_date),
      endDate: goal.end_date ? new Date(goal.end_date) : null,
      completed: goal.completed,
    }));
  }

  async startStudySession(category?: QuestionCategory): Promise<string | null> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return null;

    const { data, error } = await this.supabase
      .from("study_sessions")
      .insert([
        {
          user_id: user.data.user.id,
          category,
          start_time: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error starting study session:", error);
      return null;
    }

    return data.id;
  }

  async endStudySession(sessionId: string): Promise<boolean> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return false;

    const endTime = new Date();
    const { data, error } = await this.supabase
      .from("study_sessions")
      .update({
        end_time: endTime.toISOString(),
        duration_minutes: (prev: any) => {
          const startTime = new Date(prev.start_time);
          return Math.round((endTime.getTime() - startTime.getTime()) / 60000);
        },
      })
      .eq("id", sessionId)
      .eq("user_id", user.data.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error ending study session:", error);
      return false;
    }

    return true;
  }

  async updateProgress(
    category: QuestionCategory,
    isCorrect: boolean
  ): Promise<void> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return;

    // Start a transaction to update both user_progress and category_progress
    const { error } = await this.supabase.rpc(
      "update_user_and_category_progress",
      {
        p_category: category,
        p_is_correct: isCorrect,
        p_user_id: user.data.user.id,
      }
    );

    if (error) {
      console.error("Error updating progress:", error);
    }
  }

  async createGoal(
    goalType: "questions_per_day" | "study_time_per_week",
    targetValue: number,
    category?: QuestionCategory,
    endDate?: Date
  ): Promise<string | null> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) return null;

    const { data, error } = await this.supabase
      .from("user_goals")
      .insert([
        {
          user_id: user.data.user.id,
          category,
          goal_type: goalType,
          target_value: targetValue,
          start_date: new Date().toISOString(),
          end_date: endDate?.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating goal:", error);
      return null;
    }

    return data.id;
  }
}

export const dashboardService = new DashboardService();
