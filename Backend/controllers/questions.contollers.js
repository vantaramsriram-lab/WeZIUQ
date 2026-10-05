import { Question } from "../models/question.models.js";
const getQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await Question.find({ quizId });
    if (questions.length === 0) {
      return res.status(404).json({
        message: "Questions Not Found. Add Questions"
      })
    }
    res.status(200).json(questions)
  } catch (err) {
    res.status(500).json({
      message: 'Server error', error: err.message
    })
  }
}

const addQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    const { quizId } = req.params

    if (!question || !options || !correctAnswer) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (!Array.isArray(options)) {
      return res.status(400).json({ message: "Options must be an array" });
    }
    if (options.length !== 4) {
      return res.status(400).json({ message: 'Exactly 4 options are required' });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }
    const newQuestion = await Question.create(
      {
        quizId,
        question,
        options,
        correctAnswer
      }
    )
    res.status(201).json({
      message: "Question created Successfully",
      newQuestion,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server error', error: err.message
    })
  }
}


const updateQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    const { quizId } = req.params
    if (!question || !options || !correctAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (options.length !== 4) {
      return res.status(400).json({ message: 'Exactly 4 options are required' });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }
    const questionId = req.params.questionId
    let updatedQuestion = await Question.findOneAndUpdate({ quizId, _id: questionId }, {
      question, options, correctAnswer
    }, { new: true, runValidators: true });
    if (!updatedQuestion) {
      return res.status(404).json({
        message: "Question Not Found with provided id"
      })
    }
    res.status(200).json({
      message: "Question Updated",
      updatedQuestion
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server error in update section', error: err.message
    })
  }
}


const deleteQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params
    const deletedQuestion = await Question.findOneAndDelete({ quizId, _id: questionId });
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  }
  catch (err) {
    res.status(500).json({
      message: 'Server error in delete section', error: err.message
    })
  }
}


export { addQuestion, getQuestions, updateQuestion, deleteQuestion }