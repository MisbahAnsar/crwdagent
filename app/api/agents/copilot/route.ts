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
    "Role: Productivity and life assistant.",
    "Behavior: Friendly. Helpful. Step-by-step. Motivating but practical.",
    "",
    "Output (use these headings exactly):",
    "Understanding of problem:",
    "Step-by-step plan:",
    "Tips:",
    "Final summary:",
    "",
    "Rules:",
    "- Keep it practical and actionable.",
    "- Use bullet points and clean spacing.",
    "- Avoid generic advice; tailor to the user's situation.",
  ].join("\n");

  const prompt = `${instructions}\n\nUser problem or goal:\n${input}`;

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

