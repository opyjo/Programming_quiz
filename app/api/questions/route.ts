import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import { QuestionCategory } from "@/utils/supabase";

function getTableName(category: QuestionCategory): string {
  const tableMap: Record<QuestionCategory, string> = {
    React: "react_questions",
    Vue: "vue_questions",
    Angular: "angular_questions",
    "Next.js": "nextjs_questions",
    Nuxt: "nuxt_questions",
    Svelte: "svelte_questions",
    HTML: "web_development",
    CSS: "web_development",
    JavaScript: "web_development",
    TypeScript: "web_development",
    Accessibility: "web_development",
    Performance: "web_development",
    Security: "web_development",
    General: "web_development",
  };

  return tableMap[category];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as QuestionCategory;
  const random = searchParams.get("random") === "true";
  const lastQuestionId = searchParams.get("lastQuestionId");

  if (!category) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }

  const tableName = getTableName(category);

  try {
    let query = supabase.from(tableName).select("*");

    if (category) {
      query = query.eq("category", category);
    }

    if (random) {
      // Use PostgreSQL's random() function for true randomization
      query = query.order("RANDOM()").limit(1);
    } else if (lastQuestionId) {
      // For sequential fetching, get the next question after the last one
      const { data: lastQuestion } = await supabase
        .from(tableName)
        .select("created_at")
        .eq("id", lastQuestionId)
        .single();

      if (lastQuestion) {
        query = query
          .gt("created_at", lastQuestion.created_at)
          .order("created_at")
          .limit(1);
      }
    } else {
      // If no lastQuestionId, get the first question
      query = query.order("created_at").limit(1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch questions" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      // If no more questions in sequence, start over
      if (lastQuestionId && !random) {
        const { data: firstQuestion, error: firstQuestionError } =
          await supabase
            .from(tableName)
            .select("*")
            .eq(category ? "category" : "id", category || "id")
            .order("created_at")
            .limit(1);

        if (firstQuestionError) {
          return NextResponse.json(
            { error: "Failed to fetch first question" },
            { status: 500 }
          );
        }

        return NextResponse.json(firstQuestion);
      }

      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
