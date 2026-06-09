const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: false,
  }
);

conversationSchema.index({ question: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
