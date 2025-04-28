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

  private getTableName(category: QuestionCategory): string {
    // Map categories to their respective tables
    const tableMap: Record<QuestionCategory, string> = {
      React: "react_questions",
      Vue: "vue_questions",
      Angular: "angular_questions",
      "Next.js": "nextjs_questions",
      Nuxt: "nuxt_questions",
      Svelte: "svelte_questions",
      HTML: "web_development",
      CSS: "web_development",
      JavaScript: "web_development",
      TypeScript: "web_development",
      Accessibility: "web_development",
      Performance: "web_development",
      Security: "web_development",
      General: "web_development",
    };

    return tableMap[category];
  }

  private isFrameworkCategory(category: QuestionCategory): boolean {
    return ["React", "Vue", "Angular", "Next.js", "Nuxt", "Svelte"].includes(
      category
    );
  }

  async getRandomQuestion(
    category: QuestionCategory,
    currentQuestionId?: string
  ): Promise<Question | null> {
    try {
      console.log("Fetching random question for category:", category);
      const tableName = this.getTableName(category);
      const isFramework = this.isFrameworkCategory(category);

      // First, count total questions
      let countQuery = this.supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });

      // Only apply category filter for non-framework tables
      if (!isFramework) {
        countQuery = countQuery.eq("category", category);
      }

      const { count } = await countQuery;

      if (!count) return null;

      // Get a random offset
      const randomOffset = Math.floor(Math.random() * count);

      // Build the query
      let query = this.supabase
        .from(tableName)
        .select("*")
        .limit(1)
        .range(randomOffset, randomOffset);

      // Only apply category filter for non-framework tables
      if (!isFramework) {
        query = query.eq("category", category);
      }

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
        let retryQuery = this.supabase
          .from(tableName)
          .select("*")
          .limit(1)
          .range(newOffset, newOffset);

        // Only apply category filter for non-framework tables
        if (!isFramework) {
          retryQuery = retryQuery.eq("category", category);
        }

        const { data: retryData, error: retryError } = await retryQuery;

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
      const tableName = this.getTableName(category);
      const isFramework = this.isFrameworkCategory(category);

      // If no current question, get the first question
      if (!currentQuestionId) {
        let query = this.supabase
          .from(tableName)
          .select("*")
          .order("created_at", { ascending: true })
          .limit(1);

        // Only apply category filter for non-framework tables
        if (!isFramework) {
          query = query.eq("category", category);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data?.[0] || null;
      }

      // Get all questions ordered by created_at
      let query = this.supabase
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: true });

      // Only apply category filter for non-framework tables
      if (!isFramework) {
        query = query.eq("category", category);
      }

      const { data: allQuestions, error: allError } = await query;

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
