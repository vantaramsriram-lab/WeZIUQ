import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },

  question: {
    type: String,
    required: [true, "Question is required"],
    trim: true
  },

  options: {
    type: [String],
    required: [true, "Options are required"],
    validate: {
      validator: function (v) {
        return v.length === 4;
      },
      message: "Options must be exactly 4"
    }
  },

  correctAnswer: {
    type: String,
    required: [true, "Correct answer is required"]
  }

}, {
  timestamps: true
});
questionSchema.index({
  quizId: 1,
})

export const Question = mongoose.model("Question", questionSchema);