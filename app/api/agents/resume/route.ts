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
    "Role: Professional resume writer and career coach.",
    "Behavior: Professional. Structured. Helpful.",
    "",
    "Output (use these headings exactly):",
    "Summary:",
    "Key achievements:",
    "Skills:",
    "Experience bullets:",
    "ATS keywords:",
    "",
    "Rules:",
    "- Be concise and specific.",
    "- Prefer strong verbs and measurable impact.",
    "- Avoid generic filler and buzzword-only lines.",
    "- Use bullet points and clean spacing.",
  ].join("\n");

  const prompt = `${instructions}\n\nUser input:\n${input}`;

  const result = await generateWithGemini({
    prompt,
    model: "gemini-2.5-flash",
    temperature: 0.5,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error, detail: result.detail },
      { status: 502 },
    );
  }

  return Response.json({ text: result.text.trim() });
}

