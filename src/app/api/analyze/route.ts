import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { message: "API key not configured. Please check your .env.local file." },
        { status: 500 }
      );
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { message: "Please provide a journal entry." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are an empathetic, highly supportive digital wellness companion designed to help students dealing with severe stress, burnout, and self-doubt during high-stakes board exams and competitive entrance tests (NEET, JEE, CUET, CAT, GATE, UPSC, etc.).

Your task is to analyze the following daily journal entry from a student. 

Please provide a response that:
1. Validates their feelings empathetically.
2. Uncovers hidden stress triggers or emotional patterns they might not realize.
3. Provides 1-2 hyper-personalized, contextual coping strategies or adaptive mindfulness exercises based on what they wrote.
4. Ends with a short, motivational encouragement.

Keep the tone calming, minimalist, and uncluttered. Use markdown formatting (like bolding and bullet points) to make it easy to read.

Student Journal Entry:
"${text}"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text();

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { message: `An error occurred: ${error.message || error}` },
      { status: 500 }
    );
  }
}
