export type GeminiResult =
  | { ok: true; text: string }
  | { ok: false; error: string; detail?: string };

function pickFirstText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const candidates = (data as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const content = (candidates[0] as { content?: unknown }).content;
  if (!content || typeof content !== "object") return null;
  const parts = (content as { parts?: unknown }).parts;
  if (!Array.isArray(parts) || parts.length === 0) return null;
  const text = (parts[0] as { text?: unknown }).text;
  return typeof text === "string" ? text : null;
}

export async function generateWithGemini(args: {
  prompt: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Missing GEMINI_API_KEY. Set it in .env.local." };
  }

  const model = args.model ?? "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model,
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const generationConfig: Record<string, unknown> = {
    temperature: args.temperature ?? 0.7,
    topP: 0.95,
  };
  if (typeof args.maxOutputTokens === "number") {
    generationConfig.maxOutputTokens = args.maxOutputTokens;
  }

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: args.prompt }] }],
      generationConfig,
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    return { ok: false, error: "Gemini request failed.", detail };
  }

  const data = (await upstream.json().catch(() => null)) as unknown;
  const text = pickFirstText(data);
  if (!text) {
    return { ok: false, error: "Unexpected Gemini response format." };
  }
  return { ok: true, text };
}

