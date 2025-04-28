import { createClient } from "@/lib/supabase/client";
import { QuestionCategory } from "@/utils/supabase";

export interface Question {
  id: string;
  category: QuestionCategory;
  question_text: string;
  answer_text: string;
  difficulty: string;
  created_at: string;
}

class QuizService {
  private supabase = createClient();

  async getRandomQuestion(
    category: QuestionCategory,
    currentQuestionId?: string
  ): Promise<Question | null> {
    try {
      console.log("Fetching random question for category:", category);

      // First, count total questions for this category
      const { count } = await this.supabase
        .from("interview_questions")
        .select("*", { count: "exact", head: true })
        .eq("category", category);

      if (!count) return null;

      // Get a random offset
      const randomOffset = Math.floor(Math.random() * count);

      // Build the query
      let query = this.supabase
        .from("interview_questions")
        .select("*")
        .eq("category", category)
        .limit(1)
        .range(randomOffset, randomOffset);

      // Only add the neq condition if we have a current question ID
      if (currentQuestionId) {
        query = query.neq("id", currentQuestionId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching random question:", error);
        throw error;
      }

      // If we got the same question or no question, try one more time with a different offset
      if (
        !data?.length ||
        (currentQuestionId && data[0].id === currentQuestionId)
      ) {
        const newOffset = (randomOffset + 1) % count;
        const { data: retryData, error: retryError } = await this.supabase
          .from("interview_questions")
          .select("*")
          .eq("category", category)
          .limit(1)
          .range(newOffset, newOffset);

        if (retryError) throw retryError;
        return retryData?.[0] || null;
      }

      return data[0];
    } catch (error) {
      console.error("Error in getRandomQuestion:", error);
      throw error;
    }
  }

  async getSequentialQuestion(
    category: QuestionCategory,
    currentQuestionId?: string
  ): Promise<Question | null> {
    try {
      // If no current question, get the first question
      if (!currentQuestionId) {
        const { data, error } = await this.supabase
          .from("interview_questions")
          .select("*")
          .eq("category", category)
          .order("created_at", { ascending: true })
          .limit(1);

        if (error) throw error;
        return data?.[0] || null;
      }

      // Get all questions for the category ordered by created_at
      const { data: allQuestions, error: allError } = await this.supabase
        .from("interview_questions")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: true });

      if (allError) throw allError;
      if (!allQuestions?.length) return null;

      // Find the current question's index
      const currentIndex = allQuestions.findIndex(
        (q: Question) => q.id === currentQuestionId
      );
      if (currentIndex === -1) {
        // If current question not found, return first question
        return allQuestions[0];
      }

      // Get next question or loop back to first
      const nextIndex = (currentIndex + 1) % allQuestions.length;
      return allQuestions[nextIndex];
    } catch (error) {
      console.error("Error in getSequentialQuestion:", error);
      throw error;
    }
  }
}

export const quizService = new QuizService();
