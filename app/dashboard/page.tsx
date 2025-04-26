"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { BarChart, BookOpen, CheckCircle, Clock } from "lucide-react"

export default function DashboardPage() {
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

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36</div>
                <p className="text-xs text-muted-foreground">+8 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2h</div>
                <p className="text-xs text-muted-foreground">+1.2h from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3 days</div>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent quiz activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      category: "Web Development",
                      difficulty: "Intermediate",
                      question: "What is the purpose of the 'useEffect' hook in React?",
                      time: "Today, 10:30 AM",
                    },
                    {
                      category: "Web Development",
                      difficulty: "Beginner",
                      question: "Explain the concept of the CSS Box Model.",
                      time: "Yesterday, 3:15 PM",
                    },
                    {
                      category: "Python",
                      difficulty: "Beginner",
                      question: "What are Python list comprehensions?",
                      time: "Yesterday, 2:45 PM",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.question}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.category} • {item.difficulty}
                        </p>
                      </div>
                      <div className="ml-auto text-xs text-muted-foreground">{item.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Quizzes</CardTitle>
                <CardDescription>Based on your activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      category: "Web Development",
                      title: "Advanced JavaScript Concepts",
                      questions: 15,
                      difficulty: "Advanced",
                    },
                    {
                      category: "Python",
                      title: "Python Data Structures",
                      questions: 12,
                      difficulty: "Intermediate",
                    },
                    {
                      category: "Web Development",
                      title: "React Hooks Deep Dive",
                      questions: 10,
                      difficulty: "Intermediate",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.category} • {item.difficulty} • {item.questions} questions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your progress across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Web Development</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Python</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Golang</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Java</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Statistics</CardTitle>
              <CardDescription>Your performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs text-muted-foreground">Percentage of quizzes completed</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Average Time</p>
                  <p className="text-2xl font-bold">3.5 min</p>
                  <p className="text-xs text-muted-foreground">Average time per question</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Favorite Category</p>
                  <p className="text-2xl font-bold">Web Development</p>
                  <p className="text-xs text-muted-foreground">Based on activity</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Total Study Time</p>
                  <p className="text-2xl font-bold">24.5 hours</p>
                  <p className="text-xs text-muted-foreground">Across all quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
