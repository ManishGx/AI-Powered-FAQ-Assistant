require("dotenv").config();

const Conversation = require("../models/Conversation");
const { OpenAI } = require("openai");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = "openrouter/free";

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is required in backend/.env");
}

if (process.env.OPENROUTER_MODEL && process.env.OPENROUTER_MODEL !== OPENROUTER_MODEL) {
  console.warn("OPENROUTER_MODEL override is ignored. Only openrouter/free is supported.");
}

const openRouterClient = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");

const getAnswerText = (completion) =>
  completion?.choices?.[0]?.message?.content || null;

const askQuestion = async (req, res, next) => {
  try {
    const question = req.sanitizedQuestion;

    const existingConversation = await Conversation.findOne({
      question: { $regex: `^${escapeRegExp(question)}$`, $options: "i" },
    });

    if (existingConversation) {
      return res.status(200).json({
        answer: existingConversation.answer,
        existing: true,
      });
    }

    const completion = await openRouterClient.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: question }],
      temperature: 0.2,
      max_tokens: 500,
    });

    const answer = getAnswerText(completion);
    if (!answer) {
      const error = new Error("AI service returned an empty response.");
      error.status = 502;
      throw error;
    }

    await Conversation.create({
      question,
      answer,
    });

    return res.status(200).json({ answer, existing: false });
  } catch (error) {
    const statusCode = error.status || error?.response?.status || 500;
    const safeError = new Error(
      statusCode === 429
        ? "Rate limit exceeded. Please try again shortly."
        : "Unable to process your request at this time. Please try again later."
    );
    safeError.status = statusCode >= 400 && statusCode < 500 ? statusCode : 502;

    if (process.env.NODE_ENV !== "production") {
      console.error("AI service error:", error?.message || error);
    }

    return next(safeError);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const { q } = req.query;
    const filter = {};

    if (q && typeof q === "string" && q.trim()) {
      const regex = new RegExp(escapeRegExp(q.trim()), "i");
      filter.$or = [{ question: regex }, { answer: regex }];
    }

    const conversations = await Conversation.find(filter).sort({ timestamp: -1 });
    return res.status(200).json(conversations);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Database error:", error?.message || error);
    }
    const safeError = new Error("Unable to fetch conversations at this time.");
    safeError.status = 500;
    return next(safeError);
  }
};

module.exports = {
  askQuestion,
  getConversations,
};
