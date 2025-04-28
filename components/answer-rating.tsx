import { cn } from "@/lib/utils";

interface AnswerRatingProps {
  score: number;
  feedback: string;
  isLoading?: boolean;
}

export function AnswerRating({
  score,
  feedback,
  isLoading,
}: AnswerRatingProps) {
  // Convert score to percentage
  const percentage = Math.round(score * 100);

  // Determine color based on score
  const getColorClass = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    if (score >= 0.4) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="rounded-lg border p-4 mb-4 bg-muted">
      <h4 className="font-medium mb-3">AI Evaluation</h4>

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-2 bg-muted-foreground/20 rounded"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  getColorClass(score)
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{feedback}</p>
        </>
      )}
    </div>
  );
}
