const MAX_QUESTION_LENGTH = 1000;

const sanitizeText = (value) =>
  String(value)
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const validateChatRequest = (req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ message: "Invalid request payload." });
  }

  const allowedKeys = ["question"];
  const unknownKeys = Object.keys(req.body).filter((key) => !allowedKeys.includes(key));
  if (unknownKeys.length > 0) {
    return res.status(400).json({
      message: `Unsupported request field(s): ${unknownKeys.join(", ")}`,
    });
  }

  const { question } = req.body;
  if (typeof question !== "string") {
    return res.status(400).json({ message: "Question must be a string." });
  }

  const sanitizedQuestion = sanitizeText(question);
  if (!sanitizedQuestion) {
    return res.status(400).json({ message: "Question cannot be empty." });
  }

  if (sanitizedQuestion.length > MAX_QUESTION_LENGTH) {
    return res.status(400).json({
      message: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer.`,
    });
  }

  if (/(.)\1{50,}/.test(sanitizedQuestion)) {
    return res.status(400).json({ message: "Question contains suspicious repeated characters." });
  }

  req.sanitizedQuestion = sanitizedQuestion;
  next();
};

module.exports = validateChatRequest;
