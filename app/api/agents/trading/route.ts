import { generateWithGemini } from "../../../../lib/gemini";

type Body = { prompt?: unknown };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const userPrompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!userPrompt) {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  const instructions = [
    "Role: Professional crypto trader and analyst.",
    "Behavior: Analytical. Data-driven tone. Not generic.",
    "",
    "Formatting:",
    "- Output bullet points only. No headings. No markdown. No '#'. No '**'.",
    "- Each bullet must start with '- ' and begin with a label:",
    "  Market Insight | Opportunity | Suggested Action | Risk Level | Reasoning",
    "",
    "Output requirements:",
    "- Include at least 2 bullets for Market Insight.",
    "- Include 2–4 Opportunity bullets (ranked if multiple).",
    "- Include exactly 1 Suggested Action bullet with (Buy/Sell/Watch).",
    "- Include exactly 1 Risk Level bullet with (Low/Medium/High).",
    "- Include 2–3 Reasoning bullets with concrete invalidation / risk controls when relevant.",
    "",
    "Rules:",
    "- Always include reasoning and trade-offs.",
    "- Avoid generic advice and vague claims. Be specific about what would invalidate the idea.",
    "- When relevant, include: timeframe, key levels (support/resistance), catalyst, and risk controls (entry/stop/targets).",
    "- If the user prompt is broad (e.g., 'short term crypto opportunities'), propose 2–3 concrete setups and rank them.",
  ].join("\n");

  const prompt = `${instructions}\n\nUser query:\n${userPrompt}`;

  const result = await generateWithGemini({
    prompt,
    model: "gemini-2.5-flash",
    temperature: 0.7,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error, detail: result.detail },
      { status: 502 },
    );
  }

  return Response.json({ text: result.text.trim() });
}

