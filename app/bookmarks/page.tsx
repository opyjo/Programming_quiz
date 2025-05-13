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
import { Loader2, BookOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { QuizProvider } from "@/contexts/QuizContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type BookmarkedQuestion = {
  id: string;
  question_text: string;
  category: string;
  difficulty: string;
  table: string;
};

type AnswerState = {
  answer: string | null;
  loading: boolean;
  error: string | null;
};

function BookmarksContent() {
  const { bookmarkedQuestionIds, toggleBookmark } = useQuiz();
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [questions, setQuestions] = useState<BookmarkedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [answerStates, setAnswerStates] = useState<Record<string, AnswerState>>(
    {}
  );

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
      let allQuestions: BookmarkedQuestion[] = [];
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
      setQuestions(allQuestions);
      setLoading(false);
    };
    fetchBookmarkedQuestions();
  }, [user, supabase, bookmarkedQuestionIds]);

  const handleDeleteBookmark = async (questionId: string, category: string) => {
    if (!user) return;
    setDeletingId(questionId);
    await toggleBookmark(questionId, category as any); // This will remove from context
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setDeletingId(null);
  };

  const handleShowAnswer = async (question: BookmarkedQuestion) => {
    const questionId = question.id;
    // If answer already fetched or loading, do nothing (or maybe toggle visibility later)
    if (answerStates[questionId]?.answer || answerStates[questionId]?.loading) {
      return;
    }

    setAnswerStates((prev) => ({
      ...prev,
      [questionId]: { answer: null, loading: true, error: null },
    }));

    try {
      const response = await fetch("/api/generate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question_text,
          category: question.category,
          difficulty: question.difficulty,
          // No userAnswer needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch answer");
      }

      const data = await response.json();
      setAnswerStates((prev) => ({
        ...prev,
        [questionId]: { answer: data.answer, loading: false, error: null },
      }));
    } catch (error: any) {
      console.error("Error fetching answer:", error);
      setAnswerStates((prev) => ({
        ...prev,
        [questionId]: {
          answer: null,
          loading: false,
          error: error.message || "Could not load answer.",
        },
      }));
      // Optionally add toast notification here
    }
  };

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
          {questions.map((q: BookmarkedQuestion) => {
            const currentAnswerState = answerStates[q.id] || {
              answer: null,
              loading: false,
              error: null,
            };
            return (
              <Card key={q.id}>
                <CardHeader className="flex flex-row justify-between items-start gap-2">
                  <div className="flex-1">
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
                  </div>
                  <button
                    type="button"
                    aria-label="Delete bookmark"
                    tabIndex={0}
                    onClick={() => handleDeleteBookmark(q.id, q.category)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleDeleteBookmark(q.id, q.category);
                    }}
                    className="ml-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 text-red-600"
                    disabled={deletingId === q.id}
                  >
                    <Trash2
                      className={`h-5 w-5 ${
                        deletingId === q.id ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </CardHeader>
                <CardContent>
                  {/* Show Answer Button */}
                  {!currentAnswerState.answer && !currentAnswerState.error && (
                    <Button
                      onClick={() => handleShowAnswer(q)}
                      disabled={currentAnswerState.loading}
                      size="sm"
                      variant="outline"
                      aria-label="Show answer"
                    >
                      {currentAnswerState.loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Show Answer"
                      )}
                    </Button>
                  )}

                  {/* Answer Display Area */}
                  {currentAnswerState.answer && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-sm mb-2">Answer:</h4>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: currentAnswerState.answer,
                        }}
                      />
                    </div>
                  )}
                  {/* Error Display */}
                  {currentAnswerState.error && (
                    <p className="mt-4 text-sm text-red-600">
                      Error: {currentAnswerState.error}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BookmarksPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        "/auth/sign-in?redirect=" + encodeURIComponent("/bookmarks")
      );
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    // Optionally show a loader here
    return null;
  }

  return (
    <QuizProvider>
      <BookmarksContent />
    </QuizProvider>
  );
}
