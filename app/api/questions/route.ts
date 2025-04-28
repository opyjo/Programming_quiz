import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const random = searchParams.get("random") === "true";
  const lastQuestionId = searchParams.get("lastQuestionId");

  try {
    let query = supabase.from("interview_questions").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    if (random) {
      // Use PostgreSQL's random() function for true randomization
      query = query.order("RANDOM()").limit(1);
    } else if (lastQuestionId) {
      // For sequential fetching, get the next question after the last one
      const { data: lastQuestion } = await supabase
        .from("interview_questions")
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
            .from("interview_questions")
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
