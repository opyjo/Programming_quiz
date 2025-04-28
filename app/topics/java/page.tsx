"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import { QuestionCategory } from "@/utils/supabase";
import {
  Check,
  ChevronLeft,
  Code,
  Lightbulb,
  Loader2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Toaster } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AnswerRating } from "@/components/answer-rating";

// Define Java-specific categories
type JavaQuestionCategory = "General" | QuestionCategory;

function JavaContent() {
  const {
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
  } = useQuiz();

  const [userAnswer, setUserAnswer] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("question");

  const categories: JavaQuestionCategory[] = [
    "General", // Using the shared "General" category
  ];

  const handleSubmitAnswer = async () => {
    setAnswerSubmitted(true);
    await generateAnswer(userAnswer);
  };

  const handleShowSolution = async () => {
    setActiveTab("answer");
    await generateAnswer();
  };

  const handleNextQuestion = () => {
    setUserAnswer("");
    setAnswerSubmitted(false);
    setActiveTab("question");
    fetchQuestion(false);
  };

  const handleRandomQuestion = () => {
    setUserAnswer("");
    setAnswerSubmitted(false);
    setActiveTab("question");
    fetchQuestion(true);
  };

  const handleStartOver = () => {
    setUserAnswer("");
    setAnswerSubmitted(false);
    setShowAnswer(false);
    setSelectedCategory(null);
    setActiveTab("question");
  };

  return (
    <div className="flex flex-col space-y-6 mx-auto max-w-3xl">
      <Card className="w-full shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl">
                Java Programming Quiz
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Test your Java programming skills with interactive questions
              </CardDescription>
            </div>
            {selectedCategory && (
              <div className="flex items-center">
                <span className="text-sm font-medium mr-3">
                  {selectedCategory}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartOver}
                  disabled={isLoading || isGenerating}
                  className="flex items-center text-xs"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Change
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
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
          ) : !currentQuestion ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ready to start practicing {selectedCategory} questions?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => fetchQuestion(false)}
                  disabled={isLoading}
                  className="flex-1"
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
                  className="flex-1"
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
            <div className="space-y-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="question" className="text-sm">
                    Question
                  </TabsTrigger>
                  <TabsTrigger
                    value="answer"
                    className="text-sm"
                    disabled={!showAnswer && !answerSubmitted}
                  >
                    {answerSubmitted ? "Your Answer" : "Solution"}
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-lg">
                        <Code className="inline h-5 w-5 mr-2 text-blue-600" />
                        Question:
                      </h4>
                      <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {currentQuestion.difficulty}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {currentQuestion.question_text}
                    </p>
                  </div>

                  {activeTab === "question" && !answerSubmitted && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="user-answer"
                          className="block text-sm font-medium mb-2"
                        >
                          Your Answer
                        </label>
                        <Textarea
                          id="user-answer"
                          placeholder="Type your answer here... (supports markdown for code)"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="min-h-32 font-mono text-sm"
                          disabled={answerSubmitted}
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={
                            isLoading || isGenerating || !userAnswer.trim()
                          }
                          className="flex items-center"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Submit Answer
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={handleShowSolution}
                          disabled={isLoading || isGenerating}
                          className="text-sm"
                        >
                          <Lightbulb className="mr-2 h-4 w-4" />
                          Show Solution
                        </Button>
                      </div>
                    </div>
                  )}

                  {(activeTab === "answer" || answerSubmitted) && (
                    <div className="space-y-4">
                      {answerSubmitted && (
                        <>
                          <div className="rounded-lg border p-4 mb-4 bg-blue-50 dark:bg-blue-900/20">
                            <h4 className="font-medium mb-2">
                              Your Submission:
                            </h4>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border font-mono text-sm whitespace-pre-wrap">
                              {userAnswer}
                            </div>
                          </div>

                          <AnswerRating
                            score={answerEvaluation?.score || 0}
                            feedback={answerEvaluation?.feedback || ""}
                            isLoading={isGenerating}
                          />
                        </>
                      )}

                      <div
                        className={cn(
                          "rounded-lg border p-4",
                          showAnswer
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "bg-muted"
                        )}
                      >
                        <div className="flex items-center mb-4">
                          <Sparkles className="h-5 w-5 mr-2 text-green-600" />
                          <h4 className="font-medium">Official Solution:</h4>
                        </div>

                        {isGenerating ? (
                          <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Generating solution...</span>
                          </div>
                        ) : (
                          <>
                            <div
                              className="mt-2 text-muted-foreground prose dark:prose-invert max-w-none"
                              dangerouslySetInnerHTML={{
                                __html:
                                  generatedAnswer ||
                                  currentQuestion.answer_text,
                              }}
                            />

                            {resources.length > 0 && (
                              <div className="mt-6 border-t pt-4">
                                <h4 className="font-medium mb-2">
                                  Additional Resources:
                                </h4>
                                <ul className="space-y-2">
                                  {resources.map((resource, index) => (
                                    <li key={index}>
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                      >
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        {resource.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          )}
        </CardContent>

        {selectedCategory && currentQuestion && showAnswer && (
          <CardFooter className="flex justify-between pt-2 border-t">
            <div className="flex gap-3">
              <Button
                onClick={handleNextQuestion}
                disabled={isLoading || isGenerating}
              >
                Next Question
              </Button>
              <Button
                onClick={handleRandomQuestion}
                variant="outline"
                disabled={isLoading || isGenerating}
              >
                Random Question
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={handleStartOver}
              disabled={isLoading || isGenerating}
              className="text-sm"
            >
              Start Over
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function JavaPage() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <QuizProvider>
          <JavaContent />
        </QuizProvider>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
