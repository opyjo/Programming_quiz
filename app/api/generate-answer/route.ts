import { OpenAIStream } from "@/lib/openai";
import { QuestionCategory } from "@/utils/supabase";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { question, category, difficulty, userAnswer } = await req.json();

    if (!question || !category || !difficulty) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
        }),
        { status: 400 }
      );
    }

    // If userAnswer is provided, generate both evaluation and solution
    const prompt = userAnswer
      ? `You are an expert programming instructor evaluating a student's answer to a ${category} question.

Question (${difficulty}): ${question}

Student's Answer: ${userAnswer}

Please provide:
1. An evaluation of the student's answer (score between 0 and 1 and feedback)
2. A detailed explanation of the correct solution
3. At least 2 relevant documentation links or resources for further learning

Format your response as valid JSON with the following structure:
{
  "score": 0.8,
  "feedback": "Great explanation of X. Consider adding Y for completeness.",
  "answer": "Detailed solution with HTML formatting...",
  "resources": [
    {
      "title": "Official Documentation",
      "url": "https://example.com/docs"
    },
    {
      "title": "Additional Resource",
      "url": "https://example.com/tutorial"
    }
  ]
}

Make the answer part well-formatted using HTML tags (<p>, <code>, <pre>, <strong>, <ul>, <li> tags as needed).`
      : `You are an expert programming tutor specializing in ${category}.
      
Please provide a clear, concise answer to the following ${difficulty.toLowerCase()}-level programming question:

"${question}"

Your answer should:
1. Be appropriate for a ${difficulty.toLowerCase()}-level programmer
2. Include code examples where relevant
3. Explain key concepts clearly
4. Include at least 2 relevant documentation links or resources

Format your response as valid JSON with the following structure:
{
  "answer": "Detailed solution with HTML formatting...",
  "resources": [
    {
      "title": "Official Documentation",
      "url": "https://example.com/docs"
    },
    {
      "title": "Additional Resource",
      "url": "https://example.com/tutorial"
    }
  ]
}

Use HTML tags for better readability (<p>, <code>, <pre>, <strong>, <ul>, <li> tags as needed).`;

    try {
      const response = await OpenAIStream(prompt);
      const result = JSON.parse(response);

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (parseError: unknown) {
      const error = parseError as Error;
      console.error("OpenAI response parsing error:", error);
      return new Response(
        JSON.stringify({
          error: "Invalid response format from OpenAI",
          details: error.message,
        }),
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in generate-answer:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
