"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/context/auth-context";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { QuizProvider } from "@/contexts/QuizContext";

type BookmarkedQuestion = {
  id: string;
  question_text: string;
  category: string;
  difficulty: string;
  table: string;
};

function BookmarksContent() {
  const { bookmarkedQuestionIds } = useQuiz();
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [questions, setQuestions] = useState<BookmarkedQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookmarkedQuestions = async () => {
      if (!user || bookmarkedQuestionIds.length === 0) {
        setQuestions([]);
        return;
      }
      setLoading(true);
      // Try all question tables
      const tables = [
        "web_development",
        "react_questions",
        "vue_questions",
        "angular_questions",
        "nextjs_questions",
      ];
      let allQuestions: any[] = [];
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select("id, question_text, category, difficulty")
          .in("id", bookmarkedQuestionIds);
        if (!error && data) {
          allQuestions = allQuestions.concat(
            data.map((q: BookmarkedQuestion) => ({ ...q, table }))
          );
        }
      }
      setQuestions(allQuestions as BookmarkedQuestion[]);
      setLoading(false);
    };
    fetchBookmarkedQuestions();
  }, [user, supabase, bookmarkedQuestionIds]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Bookmarked Questions</h1>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading...
        </div>
      ) : questions.length === 0 ? (
        <p className="text-muted-foreground">No bookmarked questions yet.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q: BookmarkedQuestion) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  {q.category}{" "}
                  <span className="ml-2 text-xs text-gray-500">
                    {q.difficulty}
                  </span>
                </CardTitle>
                <CardDescription className="mt-2">
                  <span className="font-medium">Question:</span>{" "}
                  {q.question_text}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={
                    "/topics/" +
                    (q.category?.toLowerCase() || "web-development")
                  }
                  className="text-blue-600 hover:underline text-sm"
                  aria-label="Review this question"
                >
                  Review in Quiz
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookmarksPage() {
  return (
    <QuizProvider>
      <BookmarksContent />
    </QuizProvider>
  );
}
