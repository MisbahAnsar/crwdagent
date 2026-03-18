export const runtime = "nodejs";

type RunAgentRequest = {
  prompt?: unknown;
};

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

async function tryFetchXProfileText(handle: string): Promise<string | null> {
  const safeHandle = handle.replace(/^@/, "").trim();
  if (!safeHandle) return null;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 7000);
  try {
    // Best-effort: use r.jina.ai to fetch readable page text without auth.
    const url = `https://r.jina.ai/https://x.com/${encodeURIComponent(safeHandle)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "crwdagent/market-intel" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const text = await res.text();
    const trimmed = text.trim();
    if (!trimmed) return null;
    // Cap context to avoid huge prompts.
    return trimmed.slice(0, 15000);
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Missing GEMINI_API_KEY. Set it in .env.local." },
      { status: 500 },
    );
  }

  let body: RunAgentRequest;
  try {
    body = (await req.json()) as RunAgentRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  const model = "gemini-2.5-flash";
  const formattingGuardrails = [
    "Write in a professional, business-appropriate tone.",
    "Return plain text only.",
    "Do NOT use markdown (no headings, no '#', no '*', no code fences).",
    "Use short paragraphs and clear sentences.",
  ].join("\n");

  const wantsXTweets =
    /\b(tweet|tweets|x\.com|twitter|X)\b/i.test(prompt) &&
    /\b(trending|top|best|most)\b/i.test(prompt);

  const handleMatch = prompt.match(/(?:by|from)\s+@?([a-zA-Z0-9_]{1,15})/i);
  const handle = handleMatch?.[1] ? `@${handleMatch[1]}` : null;

  let xContext: string | null = null;
  if (wantsXTweets && handle) {
    xContext = await tryFetchXProfileText(handle);
  }

  const taskHint =
    wantsXTweets && handle
      ? [
          "If X profile context is provided, identify the top 5 tweets by engagement signals (likes/reposts/replies if present).",
          "For each tweet, return: tweet text (1–3 sentences), why it is trending (1 sentence), and a direct URL if available.",
          "If engagement numbers are not present, pick the most prominent tweets and say you estimated based on available signals.",
          "Do not invent URLs; only include links you can infer from context or handle + tweet id present in context.",
        ].join("\n")
      : "";

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model,
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                formattingGuardrails,
                taskHint ? `\n${taskHint}` : "",
                xContext
                  ? `\n\nX profile context (best-effort, may be incomplete):\n${xContext}`
                  : "",
                "\n\nUser request:",
                prompt,
              ].join(""),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 900,
      },
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    return Response.json(
      { error: "Gemini request failed.", detail },
      { status: 502 },
    );
  }

  const data = (await upstream.json().catch(() => null)) as unknown;
  const text = pickFirstText(data);
  if (!text) {
    return Response.json(
      { error: "Unexpected Gemini response format.", data },
      { status: 502 },
    );
  }

  return Response.json({ text });
}

