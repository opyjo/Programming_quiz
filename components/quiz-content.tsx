"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, BookOpen, Code, Brain } from "lucide-react"
import { getQuestionsByCategory } from "@/lib/questions"
import QuestionDisplay from "@/components/question-display"
import type { Question } from "@/lib/questions"

interface QuizContentProps {
  category: string
}

export default function QuizContent({ category }: QuizContentProps) {
  const [difficulty, setDifficulty] = useState<string>("all")
  const [question, setQuestion] = useState<Question | null>(null)
  const [isSelecting, setIsSelecting] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Get all questions for the category
  const allQuestions = getQuestionsByCategory(category)

  // Filter questions by difficulty
  const filteredQuestions =
    difficulty === "all"
      ? allQuestions
      : allQuestions.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase())

  // Get a random question from filtered questions
  const getRandomQuestion = () => {
    if (filteredQuestions.length === 0) return null
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length)
    return filteredQuestions[randomIndex]
  }

  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value)
  }

  // Handle start quiz
  const handleStartQuiz = () => {
    setIsLoading(true)
    setTimeout(() => {
      setQuestion(getRandomQuestion())
      setIsSelecting(false)
      setIsLoading(false)
    }, 600) // Add a small delay for animation
  }

  // Handle new question
  const handleNewQuestion = () => {
    setIsLoading(true)
    setTimeout(() => {
      setQuestion(getRandomQuestion())
      setIsLoading(false)
    }, 600) // Add a small delay for animation
  }

  // Handle back to selection
  const handleBackToSelection = () => {
    setIsSelecting(true)
    setQuestion(null)
  }

  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Count questions by difficulty
  const beginnerCount = allQuestions.filter((q) => q.difficulty === "Beginner").length
  const intermediateCount = allQuestions.filter((q) => q.difficulty === "Intermediate").length
  const advancedCount = allQuestions.filter((q) => q.difficulty === "Advanced").length

  return (
    <AnimatePresence mode="wait">
      {isSelecting ? (
        <motion.div
          key="selection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center mb-8">
            <Link href="/quiz">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{formatCategoryName(category)} Quiz</h1>
          </div>

          <Card className="mb-8 overflow-hidden border-2 border-blue-100 dark:border-blue-900/30">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6">
              <h2 className="text-2xl font-bold mb-2">Choose Difficulty Level</h2>
              <p className="text-muted-foreground mb-6">
                Select the difficulty level that matches your experience and knowledge.
              </p>

              <Tabs defaultValue="all" onValueChange={handleDifficultyChange} className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30"
                  >
                    All
                    <Badge variant="outline" className="ml-2">
                      {allQuestions.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="beginner"
                    className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30"
                  >
                    Beginner
                    <Badge variant="outline" className="ml-2">
                      {beginnerCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="intermediate"
                    className="data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900/30"
                  >
                    Intermediate
                    <Badge variant="outline" className="ml-2">
                      {intermediateCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900/30"
                  >
                    Advanced
                    <Badge variant="outline" className="ml-2">
                      {advancedCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-medium">All Difficulty Levels</h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Test your knowledge across all difficulty levels. Questions will be randomly selected from
                        beginner to advanced.
                      </p>
                      <Button onClick={handleStartQuiz} disabled={isLoading} className="w-full">
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Start Quiz"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="beginner" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Code className="h-6 w-6 text-green-600 mr-2" />
                        <h3 className="text-lg font-medium">Beginner Level</h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Perfect for those new to programming or just starting with {formatCategoryName(category)}.
                        Covers fundamental concepts and basic syntax.
                      </p>
                      <Button
                        onClick={handleStartQuiz}
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Start Beginner Quiz"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="intermediate" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Brain className="h-6 w-6 text-yellow-600 mr-2" />
                        <h3 className="text-lg font-medium">Intermediate Level</h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        For developers with some experience. Covers more complex concepts, patterns, and practical
                        applications.
                      </p>
                      <Button
                        onClick={handleStartQuiz}
                        disabled={isLoading}
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Start Intermediate Quiz"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced" className="mt-0">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-red-600 mr-2"
                        >
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                        <h3 className="text-lg font-medium">Advanced Level</h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        For experienced developers. Covers advanced topics, optimization techniques, and in-depth
                        knowledge.
                      </p>
                      <Button
                        onClick={handleStartQuiz}
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Start Advanced Quiz"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Learn at Your Pace</h3>
                  <p className="text-muted-foreground">Take your time to understand each concept thoroughly.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                    <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">AI-Powered Answers</h3>
                  <p className="text-muted-foreground">Get detailed explanations generated by our AI assistant.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                    <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Real-World Examples</h3>
                  <p className="text-muted-foreground">Practice with questions based on real interview scenarios.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="sm" onClick={handleBackToSelection} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Selection
            </Button>
            <h1 className="text-3xl font-bold">
              {formatCategoryName(category)}:{" "}
              {difficulty !== "all" ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "All Levels"}
            </h1>
          </div>

          {question && (
            <QuestionDisplay
              question={question}
              category={category}
              onNewQuestion={handleNewQuestion}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
