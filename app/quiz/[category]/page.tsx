import type { Metadata } from "next"
import { notFound } from "next/navigation"
import QuizContent from "@/components/quiz-content"

export const metadata: Metadata = {
  title: "Programming Quiz",
  description: "Test your programming knowledge with our interactive quiz",
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params

  // Validate category
  const validCategories = ["web-development", "python", "golang", "java"]
  if (!validCategories.includes(category)) {
    notFound()
  }

  // Only web-development is available for now
  if (category !== "web-development") {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Coming Soon</h1>
        <p className="mb-8">Questions for this category are currently being developed.</p>
        <a href="/quiz" className="text-blue-600 hover:underline">
          Go back to categories
        </a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <QuizContent category={category} />
    </div>
  )
}
