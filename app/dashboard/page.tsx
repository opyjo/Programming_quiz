"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Calendar, Clock, Target, Trophy, Award } from "lucide-react";
import {
  dashboardService,
  UserProgress,
  CategoryProgress,
  StudySession,
  UserGoal,
} from "@/lib/services/dashboard-service";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        "/auth/sign-in?redirect=" + encodeURIComponent(window.location.pathname)
      );
    }
  }, [isLoading, isAuthenticated, router]);

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>(
    []
  );
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function loadDashboardData() {
      setDashboardLoading(true);
      try {
        const [progress, categories, sessions, userGoals] = await Promise.all([
          dashboardService.getUserProgress(),
          dashboardService.getCategoryProgress(),
          dashboardService.getStudySessions(),
          dashboardService.getUserGoals(),
        ]);

        setUserProgress(progress);
        setCategoryProgress(categories);
        setStudySessions(sessions);
        setGoals(userGoals);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setDashboardLoading(false);
      }
    }

    loadDashboardData();
  }, [isAuthenticated]);

  const calculateTotalStudyTime = () => {
    return studySessions.reduce((total, session) => {
      return total + (session.durationMinutes || 0);
    }, 0);
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {/* Overall Progress Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questions Attempted
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProgress?.totalQuestionsAttempted || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {userProgress?.totalCorrectAnswers || 0} correct answers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProgress?.currentStreak || 0} days
            </div>
            <p className="text-xs text-muted-foreground">
              Longest: {userProgress?.longestStreak || 0} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(calculateTotalStudyTime() / 60)} hours
            </div>
            <p className="text-xs text-muted-foreground">
              {studySessions.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.filter((g) => !g.completed).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {goals.filter((g) => g.completed).length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Progress Section */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Category Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryProgress.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{category.category}</p>
                      <div className="text-xs text-muted-foreground">
                        {category.correctAnswers} /{" "}
                        {category.questionsAttempted} correct
                      </div>
                    </div>
                    <span className="text-sm font-bold">
                      {Math.round(category.accuracy)}%
                    </span>
                  </div>
                  <Progress value={category.accuracy} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Goals Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studySessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between border-b last:border-0 pb-2"
                >
                  <div>
                    <p className="font-medium">
                      {session.category || "General Study"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm">{session.durationMinutes} mins</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals
                .filter((g) => !g.completed)
                .slice(0, 5)
                .map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between border-b last:border-0 pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {goal.category || "All Categories"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {goal.goalType === "questions_per_day"
                          ? "Questions per day"
                          : "Study time per week"}
                      </p>
                    </div>
                    <div className="text-sm">
                      {goal.currentValue} / {goal.targetValue}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
