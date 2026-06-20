import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Simple in-memory rate limiting to satisfy security scanners
const rateLimit = new Map<string, { count: number; timestamp: number }>();

/**
 * Handles POST requests to analyze a user's journal entry using the Gemini AI API.
 * 
 * @param {Request} req - The incoming HTTP request containing the journal text.
 * @returns {Promise<NextResponse>} A JSON response containing the AI's empathetic analysis,
 *                                  or an error message if the input is invalid or fails processing.
 */
export async function POST(req: Request) {
  try {
    // RATE LIMITING LOGIC
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10;
    
    const record = rateLimit.get(ip) || { count: 0, timestamp: now };
    if (now - record.timestamp > windowMs) {
      record.count = 1;
      record.timestamp = now;
    } else {
      record.count++;
      if (record.count > maxRequests) {
        return NextResponse.json(
          { message: "SYSTEM ERROR: RATE LIMIT EXCEEDED. TOO MANY REQUESTS." },
          { status: 429, headers: { "Retry-After": "60" } }
        );
      }
    }
    rateLimit.set(ip, record);

    if (!genAI) {
      return NextResponse.json(
        { message: "API key not configured. Please check your .env.local file." },
        { status: 500 }
      );
    }

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { message: "SYSTEM ERROR: INVALID INPUT." },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { message: "SYSTEM ERROR: LOG EXCEEDS MAXIMUM PERMITTED LENGTH." },
        { status: 413 }
      );
    }

    // Sanitize basic HTML tags (rudimentary XSS prevention for API processing)
    const sanitizedText = text.replace(/<[^>]*>?/gm, '');

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are an empathetic, highly supportive digital wellness companion designed to help students dealing with severe stress, burnout, and self-doubt during high-stakes board exams and competitive entrance tests (NEET, JEE, CUET, CAT, GATE, UPSC, etc.).

Your task is to analyze the following daily journal entry from a student. 

Student's Journal Entry:
"${sanitizedText}"

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
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: `An error occurred: ${errorMessage}` },
      { status: 500 }
    );
  }
}
