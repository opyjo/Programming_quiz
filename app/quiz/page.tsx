"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import { QuestionCategory } from "@/utils/supabase";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";

function QuizContent() {
  const {
    selectedCategory,
    currentQuestion,
    showAnswer,
    isLoading,
    isGenerating,
    generatedAnswer,
    setSelectedCategory,
    setShowAnswer,
    fetchQuestion,
    generateAnswer,
  } = useQuiz();

  const categories: QuestionCategory[] = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "TypeScript",
    "Accessibility",
    "Performance",
    "Security",
    "General",
  ];

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Programming Quiz</CardTitle>
        <CardDescription>
          Test your programming knowledge with our interactive quiz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {!selectedCategory ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select a Category</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className="h-auto py-4 text-center"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{selectedCategory}</h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                  disabled={isLoading || isGenerating}
                >
                  Change Category
                </Button>
              </div>

              {!currentQuestion ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Ready to start practicing {selectedCategory} questions?
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => fetchQuestion(false)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Start Sequential"
                      )}
                    </Button>
                    <Button
                      onClick={() => fetchQuestion(true)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Random Question"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Question:</h4>
                      <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {currentQuestion.difficulty}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {currentQuestion.question_text}
                    </p>
                  </div>

                  {showAnswer ? (
                    <div className="rounded-lg border p-4 bg-muted">
                      <h4 className="font-medium mb-4">Answer:</h4>
                      {isGenerating ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="ml-2">Generating answer...</span>
                        </div>
                      ) : (
                        <div
                          className="mt-2 text-muted-foreground prose dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{
                            __html:
                              generatedAnswer || currentQuestion.answer_text,
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={generateAnswer}
                      disabled={isLoading || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Answer...
                        </>
                      ) : (
                        "Show Answer"
                      )}
                    </Button>
                  )}

                  {showAnswer && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => fetchQuestion(false)}
                        disabled={isLoading || isGenerating}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Next Question"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAnswer(false);
                          setSelectedCategory(null);
                        }}
                        disabled={isLoading || isGenerating}
                      >
                        Start Over
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <QuizProvider>
          <QuizContent />
        </QuizProvider>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
