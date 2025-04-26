export interface Question {
  id: string
  text: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  code?: string
}

// Import questions from JSON files
import webDevelopmentQuestions from "@/data/web-development-questions.json"

// Type assertion for imported JSON
const typedWebDevQuestions = webDevelopmentQuestions as Question[]

// Get all questions for a specific category
export function getQuestionsByCategory(category: string): Question[] {
  switch (category) {
    case "web-development":
      return typedWebDevQuestions
    case "python":
    case "golang":
    case "java":
      // These categories will be implemented later
      return []
    default:
      return []
  }
}

// Get a random question from a specific category
export function getRandomQuestion(category: string): Question {
  const questions = getQuestionsByCategory(category)

  if (questions.length === 0) {
    // Return a placeholder question if no questions are available
    return {
      id: "placeholder",
      text: "No questions available for this category yet.",
      difficulty: "Beginner",
      category,
    }
  }

  const randomIndex = Math.floor(Math.random() * questions.length)
  return questions[randomIndex]
}

// Get a specific question by ID
export function getQuestionById(category: string, id: string): Question | undefined {
  const questions = getQuestionsByCategory(category)
  return questions.find((question) => question.id === id)
}
