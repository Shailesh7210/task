
export interface AiSuggestion {
  description: string;
  priority: "Low" | "Medium" | "High";
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const VALID_PRIORITIES = ["Low", "Medium", "High"];

export class AiServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = "AiServiceError";
    this.statusCode = statusCode;
  }
}

export const suggestTaskDetails = async (
  title: string
): Promise<AiSuggestion> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiServiceError("GEMINI_API_KEY is not configured on the server", 500);
  }

  const prompt = `You are helping a user fill out a task in a task manager app.
Given a rough, short task title, generate:
1. A clear, concise description (1-2 sentences, actionable, professional tone)
2. A priority level: exactly one of "Low", "Medium", or "High", based on the urgency/impact implied by the title

Task title: "${title}"

Respond ONLY with JSON matching this exact shape, no extra text:
{"description": "...", "priority": "Low" | "Medium" | "High"}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  let response: Response;
  try {
    response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new AiServiceError("AI request timed out, please try again", 504);
    }
    throw new AiServiceError("Failed to reach the AI service", 502);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new AiServiceError(
      `AI service returned an error (${response.status}): ${errText.slice(0, 200)}`,
      502
    );
  }

  const data = (await response.json()) as any;

  const rawText: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new AiServiceError("AI service returned an empty response", 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new AiServiceError("AI service returned malformed JSON", 502);
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as any).description !== "string" ||
    !VALID_PRIORITIES.includes((parsed as any).priority)
  ) {
    throw new AiServiceError("AI service returned an unexpected format", 502);
  }

  const suggestion = parsed as AiSuggestion;

  return {
    description: suggestion.description.trim().slice(0, 2000),
    priority: suggestion.priority,
  };
};