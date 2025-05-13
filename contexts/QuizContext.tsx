"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QuestionCategory } from "@/utils/supabase";
import { Question, quizService } from "@/lib/services/quiz-service";
import { toast } from "sonner";
import { dashboardService } from "@/lib/services/dashboard-service";
import { useAuth } from "@/context/auth-context";
import { useSupabase } from "@/lib/supabase/supabase-provider";

interface AnswerEvaluation {
  score: number;
  feedback: string;
}

interface Resource {
  title: string;
  url: string;
}

interface QuestionHistoryEntry {
  question: Question;
  userAnswer: string;
  evaluation: AnswerEvaluation | null;
  generatedAnswer: string | null;
  resources: Resource[];
  bookmarked?: boolean;
}

interface QuizContextType {
  selectedCategory: QuestionCategory | null;
  currentQuestion: Question | null;
  showAnswer: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  generatedAnswer: string | null;
  answerEvaluation: AnswerEvaluation | null;
  resources: Resource[];
  questionHistory: QuestionHistoryEntry[];
  currentQuestionIndex: number;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  setSelectedCategory: (category: QuestionCategory | null) => void;
  setShowAnswer: (show: boolean) => void;
  fetchQuestion: (random: boolean) => Promise<void>;
  generateAnswer: (userAnswer?: string) => Promise<void>;
  bookmarkedQuestionIds: string[];
  isBookmarked: (questionId: string) => boolean;
  toggleBookmark: (
    questionId: string,
    category: QuestionCategory
  ) => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] =
    useState<QuestionCategory | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(null);
  const [answerEvaluation, setAnswerEvaluation] =
    useState<AnswerEvaluation | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentStudySession, setCurrentStudySession] = useState<string | null>(
    null
  );
  const [questionHistory, setQuestionHistory] = useState<
    QuestionHistoryEntry[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(
    []
  );

  // Start a study session when selecting a category
  useEffect(() => {
    async function startSession() {
      if (selectedCategory && !currentStudySession) {
        const sessionId = await dashboardService.startStudySession(
          selectedCategory
        );
        setCurrentStudySession(sessionId);
      }
    }
    startSession();
  }, [selectedCategory]);

  // End study session when changing category or unmounting
  useEffect(() => {
    return () => {
      if (currentStudySession) {
        dashboardService.endStudySession(currentStudySession);
      }
    };
  }, [currentStudySession]);

  // Fetch bookmarks for the user on mount or when user changes
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setBookmarkedQuestionIds([]);
        return;
      }
      const { data, error } = await supabase
        .from("bookmarks")
        .select("question_id")
        .eq("user_id", user.id);
      if (!error && data) {
        setBookmarkedQuestionIds(
          data.map((b: { question_id: string }) => b.question_id)
        );
      }
    };
    fetchBookmarks();
  }, [user, supabase]);

  const isBookmarked = (questionId: string) =>
    bookmarkedQuestionIds.includes(questionId);

  const toggleBookmark = async (
    questionId: string,
    category: QuestionCategory
  ) => {
    if (!user) return;
    if (isBookmarked(questionId)) {
      // Remove bookmark
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("question_id", questionId);
      if (!error) {
        setBookmarkedQuestionIds((prev) =>
          prev.filter((id) => id !== questionId)
        );
      }
    } else {
      // Add bookmark
      const { error } = await supabase
        .from("bookmarks")
        .insert([{ user_id: user.id, question_id: questionId, category }]);
      if (!error) {
        setBookmarkedQuestionIds((prev) => [...prev, questionId]);
      }
    }
  };

  const generateAnswer = async (userAnswer?: string) => {
    if (!currentQuestion || !selectedCategory) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion.question_text,
          category: selectedCategory,
          difficulty: currentQuestion.difficulty,
          userAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate answer");
      }

      const data = await response.json();

      let evaluation: AnswerEvaluation | null = null;
      if (userAnswer) {
        // Update progress when user submits an answer
        const score = data.score || 0;
        await dashboardService.updateProgress(selectedCategory, score >= 0.7);
        evaluation = { score: score, feedback: data.feedback };
        setAnswerEvaluation(evaluation);
      }

      setGeneratedAnswer(data.answer);
      setResources(data.resources || []);
      setShowAnswer(true);

      // Update history entry
      setQuestionHistory((prev) => {
        if (currentQuestionIndex < 0 || currentQuestionIndex >= prev.length)
          return prev;
        const updated = [...prev];
        updated[currentQuestionIndex] = {
          ...updated[currentQuestionIndex],
          userAnswer: userAnswer || updated[currentQuestionIndex].userAnswer,
          evaluation: evaluation || updated[currentQuestionIndex].evaluation,
          generatedAnswer: data.answer,
          resources: data.resources || [],
        };
        return updated;
      });
    } catch (error) {
      console.error("Error generating answer:", error);
      toast.error("Failed to generate answer. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchQuestion = async (random: boolean) => {
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching question:", {
        random,
        category: selectedCategory,
        currentId: currentQuestion?.id,
      });
      const question = random
        ? await quizService.getRandomQuestion(
            selectedCategory,
            currentQuestion?.id
          )
        : await quizService.getSequentialQuestion(
            selectedCategory,
            currentQuestion?.id
          );

      console.log("Received question:", question);

      if (!question) {
        toast.error("No questions found for this category");
        return;
      }

      // Add to history
      const newEntry: QuestionHistoryEntry = {
        question,
        userAnswer: "",
        evaluation: null,
        generatedAnswer: null,
        resources: [],
      };
      setQuestionHistory((prev) => [
        ...prev.slice(0, currentQuestionIndex + 1),
        newEntry,
      ]);
      setCurrentQuestionIndex((prev) => prev + 1);

      setCurrentQuestion(question);
      setShowAnswer(false);
      setGeneratedAnswer(null);
      setAnswerEvaluation(null);
      setResources([]);
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Failed to fetch question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation functions
  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  };
  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      Math.min(questionHistory.length - 1, prev + 1)
    );
  };
  const jumpToQuestion = (index: number) => {
    if (index >= 0 && index < questionHistory.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Sync currentQuestion and related state with history navigation
  useEffect(() => {
    if (
      currentQuestionIndex >= 0 &&
      currentQuestionIndex < questionHistory.length
    ) {
      const entry = questionHistory[currentQuestionIndex];
      setCurrentQuestion(entry.question);
      setGeneratedAnswer(entry.generatedAnswer);
      setAnswerEvaluation(entry.evaluation);
      setResources(entry.resources);
      setShowAnswer(!!entry.generatedAnswer);
    }
  }, [currentQuestionIndex, questionHistory]);

  // When category changes, reset history
  useEffect(() => {
    setQuestionHistory([]);
    setCurrentQuestionIndex(-1);
  }, [selectedCategory]);

  const value = {
    selectedCategory,
    currentQuestion,
    showAnswer,
    isLoading,
    isGenerating,
    generatedAnswer,
    answerEvaluation,
    resources,
    questionHistory,
    currentQuestionIndex,
    goToPreviousQuestion,
    goToNextQuestion,
    jumpToQuestion,
    setSelectedCategory,
    setShowAnswer,
    fetchQuestion,
    generateAnswer,
    bookmarkedQuestionIds,
    isBookmarked,
    toggleBookmark,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
