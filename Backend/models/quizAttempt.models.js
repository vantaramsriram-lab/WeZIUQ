import mongoose from "mongoose";
const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  duration: {
    type: Number,
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },
    selectedAnswer: String,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    default: 0,
  },
  startedAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  submittedAt: {
    type: Date,
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0,
  },
  status: {
    type: String,
    enum: ['in-progress', 'submitted'],
    default: 'in-progress',
  },
}, { timestamps: true })
// One user can have only one attempt for a quiz
quizAttemptSchema.index(
  { userId: 1, quizId: 1 },
  { unique: true }
);
// Useful for admin dashboard / quiz statistics
quizAttemptSchema.index({
  quizId: 1,
  status: 1
})
export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema)