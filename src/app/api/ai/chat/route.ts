import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `Eres Atlas, el asistente de IA para Sensa Padel — un club de pádel en España.
Ayudas al General Manager (Pablo) con:
- Análisis de ingresos y reservas de pistas
- Seguimiento de leads y conversiones a socios
- Gestión de miembros y altas/bajas
- Ocupación de pistas y optimización
- Estrategias para aumentar la facturación del club

Responde siempre en español, de forma concisa y accionable. Si te piden datos específicos,
indica que puedes acceder a ellos desde el dashboard de Sensa Padel.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      system: SYSTEM_PROMPT,
      messages,
    });

    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
