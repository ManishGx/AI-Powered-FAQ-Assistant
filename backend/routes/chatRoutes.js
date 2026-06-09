const express = require("express");
const router = express.Router();
const validateChatRequest = require("../middleware/validateChatRequest");
const { askQuestion, getConversations } = require("../controllers/chatController");

router.post("/", validateChatRequest, askQuestion);
router.get("/history", getConversations);

module.exports = router;
