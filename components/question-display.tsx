"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import type { Question } from "@/lib/questions"

interface QuestionDisplayProps {
  question: Question
  category: string
  onNewQuestion: () => void
  isLoading: boolean
}

export default function QuestionDisplay({ question, category, onNewQuestion, isLoading }: QuestionDisplayProps) {
  const [answer, setAnswer] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRevealAnswer = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.text,
          category,
          difficulty: question.difficulty,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate answer")
      }

      const data = await response.json()
      setAnswer(data.answer)
    } catch (err) {
      setError("Failed to generate answer. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="mb-8 overflow-hidden border-2 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium px-2.5 py-0.5 rounded ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
            </div>
            <CardTitle className="text-xl">{question.text}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {question.code && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4 border border-gray-200 dark:border-gray-700">
                  <code className="text-sm font-mono">{question.code}</code>
                </pre>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6">
            {!answer && !isGenerating && (
              <Button onClick={handleRevealAnswer} className="w-full bg-blue-600 hover:bg-blue-700">
                Reveal Answer
              </Button>
            )}

            {isGenerating && (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Answer...
              </Button>
            )}

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </CardFooter>
        </Card>
      </motion.div>

      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="mb-8 overflow-hidden border-2 border-green-100 dark:border-green-900/30">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30">
              <CardTitle className="text-xl flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 mr-2 text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Answer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: answer }} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex justify-between mt-8"
      >
        <Link href="/quiz">
          <Button variant="outline">Back to Categories</Button>
        </Link>
        <Button onClick={onNewQuestion} variant="outline" disabled={isLoading}>
          {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          New Question
        </Button>
      </motion.div>
    </div>
  )
}
