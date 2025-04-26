"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { Bookmark, Search, Trash2, ExternalLink } from "lucide-react"

export default function BookmarksPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock bookmarked questions
  const bookmarkedQuestions = [
    {
      id: "web-dev-1",
      text: "What is the difference between 'let', 'const', and 'var' in JavaScript?",
      category: "Web Development",
      difficulty: "Beginner",
      dateBookmarked: "2023-04-15",
    },
    {
      id: "web-dev-5",
      text: "What is a Promise in JavaScript and how does it work?",
      category: "Web Development",
      difficulty: "Intermediate",
      dateBookmarked: "2023-04-18",
    },
    {
      id: "web-dev-10",
      text: "Explain the concept of closures in JavaScript with an example.",
      category: "Web Development",
      difficulty: "Intermediate",
      dateBookmarked: "2023-04-20",
    },
    {
      id: "web-dev-14",
      text: "Describe the difference between 'call', 'apply', and 'bind' methods in JavaScript.",
      category: "Web Development",
      difficulty: "Advanced",
      dateBookmarked: "2023-04-22",
    },
    {
      id: "python-1",
      text: "What are Python list comprehensions?",
      category: "Python",
      difficulty: "Beginner",
      dateBookmarked: "2023-04-25",
    },
  ]

  // Filter bookmarks based on search query
  const filteredBookmarks = bookmarkedQuestions.filter(
    (bookmark) =>
      bookmark.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group bookmarks by category
  const bookmarksByCategory: Record<string, typeof bookmarkedQuestions> = {}
  bookmarkedQuestions.forEach((bookmark) => {
    if (!bookmarksByCategory[bookmark.category]) {
      bookmarksByCategory[bookmark.category] = []
    }
    bookmarksByCategory[bookmark.category].push(bookmark)
  })

  // Group bookmarks by difficulty
  const bookmarksByDifficulty: Record<string, typeof bookmarkedQuestions> = {}
  bookmarkedQuestions.forEach((bookmark) => {
    if (!bookmarksByDifficulty[bookmark.difficulty]) {
      bookmarksByDifficulty[bookmark.difficulty] = []
    }
    bookmarksByDifficulty[bookmark.difficulty].push(bookmark)
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
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
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Bookmarks</h1>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookmarks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't bookmarked any questions yet. Start exploring quizzes and bookmark questions you want to
              revisit.
            </p>
            <Button asChild>
              <Link href="/quiz">Explore Quizzes</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Bookmarks</TabsTrigger>
            <TabsTrigger value="by-category">By Category</TabsTrigger>
            <TabsTrigger value="by-difficulty">By Difficulty</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {filteredBookmarks.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Search className="h-8 w-8 text-muted-foreground mb-4" />
                    <h2 className="text-lg font-medium mb-2">No results found</h2>
                    <p className="text-muted-foreground">
                      No bookmarks match your search query. Try a different search term.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredBookmarks.map((bookmark) => (
                  <Card key={bookmark.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2">{bookmark.category}</Badge>
                          <Badge className={`ml-2 mb-2 ${getDifficultyColor(bookmark.difficulty)}`}>
                            {bookmark.difficulty}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{bookmark.text}</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-2 flex justify-between">
                      <div className="text-xs text-muted-foreground">
                        Bookmarked on {new Date(bookmark.dateBookmarked).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/quiz/${bookmark.category.toLowerCase().replace(" ", "-")}`}>
                          View <ExternalLink className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="by-category">
            <div className="space-y-8">
              {Object.keys(bookmarksByCategory).map((category) => (
                <div key={category}>
                  <h2 className="text-xl font-bold mb-4">{category}</h2>
                  <div className="space-y-4">
                    {bookmarksByCategory[category].map((bookmark) => (
                      <Card key={bookmark.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge className={`${getDifficultyColor(bookmark.difficulty)}`}>
                              {bookmark.difficulty}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                          <CardTitle className="text-lg">{bookmark.text}</CardTitle>
                        </CardHeader>
                        <CardFooter className="pt-2 flex justify-between">
                          <div className="text-xs text-muted-foreground">
                            Bookmarked on {new Date(bookmark.dateBookmarked).toLocaleDateString()}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/quiz/${bookmark.category.toLowerCase().replace(" ", "-")}`}>
                              View <ExternalLink className="ml-2 h-3 w-3" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="by-difficulty">
            <div className="space-y-8">
              {Object.keys(bookmarksByDifficulty).map((difficulty) => (
                <div key={difficulty}>
                  <h2 className="text-xl font-bold mb-4">{difficulty}</h2>
                  <div className="space-y-4">
                    {bookmarksByDifficulty[difficulty].map((bookmark) => (
                      <Card key={bookmark.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge>{bookmark.category}</Badge>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                          <CardTitle className="text-lg">{bookmark.text}</CardTitle>
                        </CardHeader>
                        <CardFooter className="pt-2 flex justify-between">
                          <div className="text-xs text-muted-foreground">
                            Bookmarked on {new Date(bookmark.dateBookmarked).toLocaleDateString()}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/quiz/${bookmark.category.toLowerCase().replace(" ", "-")}`}>
                              View <ExternalLink className="ml-2 h-3 w-3" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
