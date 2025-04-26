"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <div className="container py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Programming Quiz</CardTitle>
            <CardDescription>
              Test your programming knowledge with our interactive quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ready to start the quiz? Click the button below to begin.
              </p>
              <Button>Start Quiz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
