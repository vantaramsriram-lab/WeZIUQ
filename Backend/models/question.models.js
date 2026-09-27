import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
    trim: true,
  },
  options: {
    type:[String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v){
        return v.length === 4
      },
      message: "Options Exactly be 4"
    },
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
  },
}, { timestamps: true })
export const Question = mongoose.model("Question", questionSchema)