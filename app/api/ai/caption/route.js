import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini/client";

export async function POST(request) {
  try {
    const { prompt, platforms, context } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = getGeminiModel();
    
    // Construct instructions based on platform constraints
    const platformInstructions = platforms.map(p => {
      if (p === 'twitter') return "- X (Twitter): Max 280 characters, use relevant hashtags.";
      if (p === 'linkedin') return "- LinkedIn: Professional tone, can be longer (up to 3000 chars), use 3-5 relevant hashtags.";
      return `- ${p.charAt(0).toUpperCase() + p.slice(1)}: Standard social media formatting.`;
    }).join('\n');

    const systemPrompt = `You are a social media expert who drafts engaging captions in a natural, human-sounding voice.
Your goal is to take a user's prompt and turn it into a high-converting social media post.

USER PROMPT: "${prompt}"
CONTEXT/TOPIC: "${context || 'General social media update'}"

CONSTRAINTS:
${platformInstructions}

Draft a single, versatile caption that works best for the selected platforms.
If platforms have wildly different constraints (like Twitter vs LinkedIn), prioritize a concise but impactful message that fits both, or provide a single version that the user can tweak.

OUTPUT:
Only return the caption text. No preamble, no "Here is your caption:". Just the text.`;

    const result = await model.generateContent(systemPrompt);
    const caption = result.response.text();

    return NextResponse.json({ success: true, caption });
  } catch (error) {
    console.error("DETAILED Gemini error:", error);
    return NextResponse.json(
      { 
        error: "AI Generation Failed", 
        details: error.message,
        hint: "Check if the GEMINI_API_KEY is valid and the model 'gemini-3.1-flash-lite-preview' is available in your region."
      },
      { status: 500 }
    );
  }
}
