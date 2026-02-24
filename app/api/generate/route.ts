import OpenAI from "openai";
import { NextResponse } from "next/server";
import { sermonSystemPrompt } from "@/lib/prompts";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { topic, scripture, videoLength, tone } = await request.json();

  if (!topic) {
    return NextResponse.json({ error: "Topic is required." }, { status: 400 });
  }

  const userPrompt = `Topic: ${topic}\nScripture: ${scripture || "None provided"}\nVideo Length: ${videoLength} minutes\nTone: ${tone}`;

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sermonSystemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "No output from model." }, { status: 500 });
    }

    const script = JSON.parse(raw);

    return NextResponse.json({ script });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed." },
      { status: 500 }
    );
  }
}
