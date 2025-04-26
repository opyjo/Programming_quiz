"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { Clock, Calendar, BarChart } from "lucide-react"

export default function HistoryPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Mock history data
  const quizHistory = [
    {
      id: "quiz-1",
      date: "2023-04-26",
      time: "10:30 AM",
      category: "Web Development",
      questionsAnswered: 15,
      timeSpent: "45 minutes",
      questions: [
        {
          id: "web-dev-1",
          text: "What is the difference between 'let', 'const', and 'var' in JavaScript?",
          difficulty: "Beginner",
        },
        {
          id: "web-dev-5",
          text: "What is a Promise in JavaScript and how does it work?",
          difficulty: "Intermediate",
        },
        {
          id: "web-dev-10",
          text: "Explain the concept of closures in JavaScript with an example.",
          difficulty: "Intermediate",
        },
      ],
    },
    {
      id: "quiz-2",
      date: "2023-04-25",
      time: "3:15 PM",
      category: "Python",
      questionsAnswered: 10,
      timeSpent: "30 minutes",
      questions: [
        {
          id: "python-1",
          text: "What are Python list comprehensions?",
          difficulty: "Beginner",
        },
        {
          id: "python-2",
          text: "Explain the difference between a tuple and a list in Python.",
          difficulty: "Beginner",
        },
      ],
    },
    {
      id: "quiz-3",
      date: "2023-04-24",
      time: "11:45 AM",
      category: "Web Development",
      questionsAnswered: 8,
      timeSpent: "25 minutes",
      questions: [
        {
          id: "web-dev-14",
          text: "Describe the difference between 'call', 'apply', and 'bind' methods in JavaScript.",
          difficulty: "Advanced",
        },
        {
          id: "web-dev-16",
          text: "Explain the concept of server-side rendering (SSR) and its benefits.",
          difficulty: "Advanced",
        },
      ],
    },
    {
      id: "quiz-4",
      date: "2023-04-22",
      time: "2:00 PM",
      category: "Web Development",
      questionsAnswered: 12,
      timeSpent: "35 minutes",
      questions: [
        {
          id: "web-dev-2",
          text: "Explain the concept of the CSS Box Model.",
          difficulty: "Beginner",
        },
        {
          id: "web-dev-11",
          text: "What is the difference between 'em' and 'rem' units in CSS?",
          difficulty: "Beginner",
        },
      ],
    },
    {
      id: "quiz-5",
      date: "2023-04-20",
      time: "9:30 AM",
      category: "Python",
      questionsAnswered: 7,
      timeSpent: "20 minutes",
      questions: [
        {
          id: "python-3",
          text: "What are decorators in Python and how do they work?",
          difficulty: "Intermediate",
        },
      ],
    },
  ]

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

  // Group history by date
  const historyByDate: Record<string, typeof quizHistory> = {}
  quizHistory.forEach((quiz) => {
    if (!historyByDate[quiz.date]) {
      historyByDate[quiz.date] = []
    }
    historyByDate[quiz.date].push(quiz)
  })

  // Group history by category
  const historyByCategory: Record<string, typeof quizHistory> = {}
  quizHistory.forEach((quiz) => {
    if (!historyByCategory[quiz.category]) {
      historyByCategory[quiz.category] = []
    }
    historyByCategory[quiz.category].push(quiz)
  })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Quiz History</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Last quiz: April 26, 2023</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            <Badge className="ml-2">52</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">Across all quizzes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h 35m</div>
            <p className="text-xs text-muted-foreground">Across all quizzes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All History</TabsTrigger>
          <TabsTrigger value="by-date">By Date</TabsTrigger>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {quizHistory.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge>{quiz.category}</Badge>
                      <span className="ml-4 text-sm text-muted-foreground">
                        {new Date(quiz.date).toLocaleDateString()} at {quiz.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">{quiz.timeSpent}</span>
                      </div>
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">{quiz.questionsAnswered} questions</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-sm font-medium mb-2">Questions Viewed:</h3>
                  <div className="space-y-2">
                    {quiz.questions.map((question) => (
                      <div key={question.id} className="flex items-center justify-between">
                        <p className="text-sm">{question.text}</p>
                        <Badge className={`${getDifficultyColor(question.difficulty)}`}>{question.difficulty}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-date">
          <div className="space-y-8">
            {Object.entries(historyByDate).map(([date, quizzes]) => (
              <div key={date}>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 mr-2" />
                  <h2 className="text-xl font-bold">{new Date(date).toLocaleDateString()}</h2>
                </div>
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <Badge>{quiz.category}</Badge>
                            <span className="ml-4 text-sm text-muted-foreground">{quiz.time}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm text-muted-foreground">{quiz.timeSpent}</span>
                            </div>
                            <div className="flex items-center">
                              <BarChart className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm text-muted-foreground">{quiz.questionsAnswered} questions</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-sm font-medium mb-2">Questions Viewed:</h3>
                        <div className="space-y-2">
                          {quiz.questions.map((question) => (
                            <div key={question.id} className="flex items-center justify-between">
                              <p className="text-sm">{question.text}</p>
                              <Badge className={`${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-category">
          <div className="space-y-8">
            {Object.entries(historyByCategory).map(([category, quizzes]) => (
              <div key={category}>
                <h2 className="text-xl font-bold mb-4">{category}</h2>
                <div className="space-y-4">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {new Date(quiz.date).toLocaleDateString()} at {quiz.time}
                          </span>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm text-muted-foreground">{quiz.timeSpent}</span>
                            </div>
                            <div className="flex items-center">
                              <BarChart className="h-4 w-4 text-muted-foreground mr-1" />
                              <span className="text-sm text-muted-foreground">{quiz.questionsAnswered} questions</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-sm font-medium mb-2">Questions Viewed:</h3>
                        <div className="space-y-2">
                          {quiz.questions.map((question) => (
                            <div key={question.id} className="flex items-center justify-between">
                              <p className="text-sm">{question.text}</p>
                              <Badge className={`${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
