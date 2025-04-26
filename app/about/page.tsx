import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Code, Brain, Users, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Programming Quiz App</h1>

        <div className="prose dark:prose-invert max-w-none mb-10">
          <p className="lead text-xl text-muted-foreground">
            Programming Quiz App is an interactive learning platform designed to help developers prepare for technical
            interviews and deepen their programming knowledge.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make quality programming education accessible to everyone. We believe that practice and
            interactive learning are key to mastering programming concepts and acing technical interviews.
          </p>

          <h2>What We Offer</h2>
          <p>
            We provide a comprehensive platform for learning programming concepts through interactive quizzes, detailed
            explanations, and curated resources. Our AI-powered explanations ensure that you not only know the answers
            but understand the underlying concepts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Comprehensive Question Bank</h3>
                <p className="text-muted-foreground">
                  Access hundreds of curated questions across multiple programming languages and difficulty levels.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">AI-Powered Explanations</h3>
                <p className="text-muted-foreground">
                  Get detailed, AI-generated explanations for each question to deepen your understanding.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Real-World Examples</h3>
                <p className="text-muted-foreground">
                  Practice with questions based on real interview scenarios from top tech companies.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <Image src="/focused-engineer.png" alt="Team Member" fill className="object-cover" />
              </div>
              <h3 className="text-lg font-medium">Alex Johnson</h3>
              <p className="text-muted-foreground">Founder & Lead Developer</p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <Image src="/images/testimonials/sarah.png" alt="Team Member" fill className="object-cover" />
              </div>
              <h3 className="text-lg font-medium">Sarah Chen</h3>
              <p className="text-muted-foreground">Content Director</p>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                <Image src="/focused-ai-innovator.png" alt="Team Member" fill className="object-cover" />
              </div>
              <h3 className="text-lg font-medium">Michael Rodriguez</h3>
              <p className="text-muted-foreground">AI Engineer</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of developers who are using Programming Quiz App to improve their skills and prepare for
            technical interviews.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                <Users className="mr-2 h-4 w-4" />
                Join Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Heart className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Quality Education</h3>
              <p className="text-muted-foreground">
                We are committed to providing high-quality educational content that is accurate, up-to-date, and
                relevant to the current industry standards.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Accessibility</h3>
              <p className="text-muted-foreground">
                We believe that quality education should be accessible to everyone, regardless of their background or
                financial situation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously strive to innovate and improve our platform to provide the best learning experience for
                our users.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Community</h3>
              <p className="text-muted-foreground">
                We foster a supportive community where developers can learn, share, and grow together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
