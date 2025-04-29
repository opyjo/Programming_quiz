"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QuestionCategory } from "@/utils/supabase";
import { Question, quizService } from "@/lib/services/quiz-service";
import { toast } from "sonner";
import { dashboardService } from "@/lib/services/dashboard-service";

interface AnswerEvaluation {
  score: number;
  feedback: string;
}

interface Resource {
  title: string;
  url: string;
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
  setSelectedCategory: (category: QuestionCategory | null) => void;
  setShowAnswer: (show: boolean) => void;
  fetchQuestion: (random: boolean) => Promise<void>;
  generateAnswer: (userAnswer?: string) => Promise<void>;
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

      if (userAnswer) {
        // Update progress when user submits an answer
        const score = data.score || 0;
        await dashboardService.updateProgress(selectedCategory, score >= 0.7);

        setAnswerEvaluation({
          score: score,
          feedback: data.feedback,
        });
      }

      setGeneratedAnswer(data.answer);
      setResources(data.resources || []);
      setShowAnswer(true);
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

  const value = {
    selectedCategory,
    currentQuestion,
    showAnswer,
    isLoading,
    isGenerating,
    generatedAnswer,
    answerEvaluation,
    resources,
    setSelectedCategory,
    setShowAnswer,
    fetchQuestion,
    generateAnswer,
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
