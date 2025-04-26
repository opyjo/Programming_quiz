import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, ExternalLink, FileText, Video } from "lucide-react"

export default function ResourcesPage() {
  // Mock data for resources
  const webDevResources = [
    {
      title: "MDN Web Docs",
      description: "The Mozilla Developer Network (MDN) provides information about Open Web technologies.",
      type: "Documentation",
      url: "https://developer.mozilla.org/",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "React Documentation",
      description: "Official React documentation with guides, API reference, and examples.",
      type: "Documentation",
      url: "https://react.dev/",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "CSS Tricks",
      description: "Tips, tricks, and techniques on using CSS.",
      type: "Tutorial",
      url: "https://css-tricks.com/",
      icon: <Code className="h-5 w-5" />,
    },
    {
      title: "JavaScript: Understanding the Weird Parts",
      description: "Deep dive into JavaScript concepts and how JavaScript works under the hood.",
      type: "Course",
      url: "https://www.udemy.com/course/understand-javascript/",
      icon: <Video className="h-5 w-5" />,
    },
    {
      title: "Eloquent JavaScript",
      description: "A book about JavaScript, programming, and the wonders of the digital.",
      type: "Book",
      url: "https://eloquentjavascript.net/",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ]

  const pythonResources = [
    {
      title: "Python Documentation",
      description: "Official Python documentation with tutorials, library reference, and more.",
      type: "Documentation",
      url: "https://docs.python.org/",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Real Python",
      description: "Python tutorials for developers of all skill levels.",
      type: "Tutorial",
      url: "https://realpython.com/",
      icon: <Code className="h-5 w-5" />,
    },
    {
      title: "Python Crash Course",
      description: "A hands-on, project-based introduction to programming with Python.",
      type: "Book",
      url: "https://nostarch.com/pythoncrashcourse2e",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ]

  const golangResources = [
    {
      title: "Go Documentation",
      description: "Official Go documentation with tutorials, references, and more.",
      type: "Documentation",
      url: "https://golang.org/doc/",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Go by Example",
      description: "Hands-on introduction to Go using annotated example programs.",
      type: "Tutorial",
      url: "https://gobyexample.com/",
      icon: <Code className="h-5 w-5" />,
    },
    {
      title: "The Go Programming Language",
      description: "A comprehensive guide to Go programming language.",
      type: "Book",
      url: "https://www.gopl.io/",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ]

  const javaResources = [
    {
      title: "Java Documentation",
      description: "Official Java documentation with tutorials, guides, and API references.",
      type: "Documentation",
      url: "https://docs.oracle.com/en/java/",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Baeldung",
      description: "In-depth articles and tutorials on Java and Spring.",
      type: "Tutorial",
      url: "https://www.baeldung.com/",
      icon: <Code className="h-5 w-5" />,
    },
    {
      title: "Effective Java",
      description: "Best practices for the Java platform.",
      type: "Book",
      url: "https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ]

  // Function to render resource cards
  const renderResourceCards = (resources: typeof webDevResources) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <div className="rounded-full bg-secondary p-2">{resource.icon}</div>
            </div>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">{resource.type}</div>
            <Button variant="outline" size="sm" asChild>
              <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                Visit <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Learning Resources</h1>
      <p className="text-muted-foreground mb-8">
        Explore these curated resources to deepen your understanding of programming concepts and prepare for technical
        interviews.
      </p>

      <Tabs defaultValue="web-development" className="space-y-6">
        <TabsList>
          <TabsTrigger value="web-development">Web Development</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="golang">Golang</TabsTrigger>
          <TabsTrigger value="java">Java</TabsTrigger>
        </TabsList>

        <TabsContent value="web-development">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Web Development Resources</h2>
              <p className="text-muted-foreground mb-6">
                Resources to help you master HTML, CSS, JavaScript, and modern web frameworks.
              </p>
            </div>
            {renderResourceCards(webDevResources)}
          </div>
        </TabsContent>

        <TabsContent value="python">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Python Resources</h2>
              <p className="text-muted-foreground mb-6">
                Resources to help you learn Python programming, data structures, and algorithms.
              </p>
            </div>
            {renderResourceCards(pythonResources)}
          </div>
        </TabsContent>

        <TabsContent value="golang">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Golang Resources</h2>
              <p className="text-muted-foreground mb-6">
                Resources to help you learn Go language basics, concurrency, and best practices.
              </p>
            </div>
            {renderResourceCards(golangResources)}
          </div>
        </TabsContent>

        <TabsContent value="java">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Java Resources</h2>
              <p className="text-muted-foreground mb-6">
                Resources to help you master Java core concepts, OOP, and enterprise development.
              </p>
            </div>
            {renderResourceCards(javaResources)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
