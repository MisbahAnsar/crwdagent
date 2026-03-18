import { generateWithGemini } from "../../../../lib/gemini";

type Body = { prompt?: unknown };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const input = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!input) {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  const instructions = [
    "Role: News analyst and briefing writer.",
    "Behavior: Analytical. Clear. Non-hype.",
    "",
    "Output (use these headings exactly):",
    "Top headlines:",
    "Why it matters:",
    "What to watch next:",
    "",
    "Rules:",
    "- Keep it concise and scannable.",
    "- Use bullet points and clean spacing.",
    "- If the user requests a source or link, say you cannot browse live news unless sources are provided, and ask for sources.",
  ].join("\n");

  const prompt = `${instructions}\n\nUser request:\n${input}`;

  const result = await generateWithGemini({
    prompt,
    model: "gemini-2.5-flash",
    temperature: 0.6,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error, detail: result.detail },
      { status: 502 },
    );
  }

  return Response.json({ text: result.text.trim() });
}

