import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  status: {
    type: String,
    enum: ["draft", "active", "completed"],
    default: "draft"
  },

  duration: {
    type: Number,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

export const Quiz = mongoose.model("Quiz", quizSchema);