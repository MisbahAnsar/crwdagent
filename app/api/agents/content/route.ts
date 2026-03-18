import { generateWithGemini } from "../../../../lib/gemini";

type Body = { prompt?: unknown };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const topic = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!topic) {
    return Response.json({ error: "Prompt is required." }, { status: 400 });
  }

  const instructions = [
    "Role: Social media growth expert.",
    "Behavior: Punchy. Engaging. Social-media optimized.",
    "",
    "Output (use these headings exactly):",
    "Hook:",
    "Main content:",
    "Call to action:",
    "Hashtags:",
    "",
    "Rules:",
    "- Short-form optimized and platform-ready.",
    "- Avoid boring or generic writing.",
    "- Keep spacing clean and easy to read.",
    "- Use bullet points only when it improves clarity.",
  ].join("\n");

  const prompt = `${instructions}\n\nTopic or idea:\n${topic}`;

  const result = await generateWithGemini({
    prompt,
    model: "gemini-2.5-flash",
    temperature: 0.9,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error, detail: result.detail },
      { status: 502 },
    );
  }

  return Response.json({ text: result.text.trim() });
}

