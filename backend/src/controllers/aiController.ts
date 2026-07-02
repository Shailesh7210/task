import { Response } from "express";
import { aiSuggestSchema } from "../utils/validators";
import { suggestTaskDetails, AiServiceError } from "../services/geminiService";
import { AuthRequest } from "../middleware/auth";

// POST /api/ai/suggest
export const aiSuggest = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = aiSuggestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  try {
    const suggestion = await suggestTaskDetails(parsed.data.title);
    res.status(200).json({ suggestion });
  } catch (err) {
    if (err instanceof AiServiceError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    throw err; // let the central error handler deal with anything unexpected
  }
};