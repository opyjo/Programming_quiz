import { type NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { question, category, difficulty } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    // Create a prompt for the OpenAI API
    const prompt = `
      You are an expert programming tutor specializing in ${category}.
      
      Please provide a clear, concise answer to the following ${difficulty.toLowerCase()}-level programming question:
      
      "${question}"
      
      Your answer should:
      1. Be appropriate for a ${difficulty.toLowerCase()}-level programmer
      2. Include code examples where relevant
      3. Explain key concepts clearly
      4. Include 1-2 relevant documentation links at the end if applicable
      
      Format your response using HTML for better readability (use <p>, <code>, <pre>, <strong>, <ul>, <li> tags as needed).
    `

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful programming tutor that provides clear, concise answers to programming questions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Extract the generated answer
    const answer = completion.choices[0].message.content

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Error generating answer:", error)
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 })
  }
}
