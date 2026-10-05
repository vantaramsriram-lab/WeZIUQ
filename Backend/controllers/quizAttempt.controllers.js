import { Question } from "../models/question.models.js";
import { Quiz } from "../models/quiz.models.js";
import { QuizAttempt } from "../models/quizAttempt.models.js";

// calculating the score 

const calculateScore = async (attempt) => {

  const questions = await Question.find({ quizId: attempt.quizId }).select("_id correctAnswer");

  const correctAnswers = new Map();

  for (const question of questions) {
    correctAnswers.set(
      question._id.toString(),
      question.correctAnswer
    )
  }

  let score = 0;

  for (const answer of attempt.answers) {
    const correctAnswer = correctAnswers.get(answer.questionId.toString());
    if (answer.selectedAnswer === correctAnswer) {
      score++;
    }
  }
  return { score, totalQuestions: questions.length }

}

const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params
    const userId = req.user._id

    // checking quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz Doesn't exist" });
    }

    //Check whether user already has an attempt

    const existingAttempt = await QuizAttempt.findOne({
      quizId: quiz._id,
      userId
    })

    // Already submitted 

    if (existingAttempt && existingAttempt.status === "submitted") {
      return res.status(403).json({ message: "You have already attempted this quiz" });
    }

    //getting this quiz questions 

    const questions = await Question.find({ quizId: quiz._id }).select("question options")
    if (questions.length === 0) return res.status(404).json({ message: "No questions Found. Contact Admin" });

    //resuming exist attempt 

    if (existingAttempt && existingAttempt.status === "in-progress") {

      const elapsed = (Date.now() - new Date(existingAttempt.startedAt).getTime()) / 1000;
      const maxTime = Number(quiz.duration) * 60;

      //if quiz expired 

      if (elapsed >= maxTime) {
        const { score, totalQuestions } = await calculateScore(existingAttempt);
        existingAttempt.score = score;
        existingAttempt.submittedAt = new Date();
        existingAttempt.totalQuestions = totalQuestions;
        existingAttempt.timeTaken = maxTime;
        existingAttempt.status = "submitted"
        await existingAttempt.save();
        return res.status(403).json({
          message: "Time limit Exceeded, Quiz submitted automatically"
        })
      }

      return res.json({
        questions,
        attempt: {
          answers: existingAttempt.answers,
          startedAt: existingAttempt.startedAt,
          id: existingAttempt._id
        },
        duration: quiz.duration
      })
    }

    //creating the new attempt

    const attempt = await QuizAttempt.create({
      userId,
      quizId: quiz._id,
      startedAt: new Date(),
      duaration: quiz.duration,
      totalQuestions: questions.length
    })
    res.json({
      questions,
      attempt: {
        answers: [],
        startedAt: attempt.startedAt,
        id: attempt._id
      },
      duration: quiz.duration
    })
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message })
  }
}

const saveAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body
    const { attemptId } = req.params;
    const attempt = await QuizAttempt.findById(attemptId);
    const duration = attempt.duration;
    if (!attempt) {
      return res.status(404).json(
        { message: "Attempt not found", }
      );
    }
    if (attempt.status !== "in-progress") {
      return res.status(403).json({
        message: "Quiz Already Submitted"
      })
    }
    const elapsed = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000;
    const maxTime = Number(duration) * 60;
    if (elapsed > maxTime) {
      return res.status(400).json({
        message: "Time limit Exceeded"
      })
    }

    const filter = {
      _id: attemptId,
      userId: req.user._id,
      status: "in-progress"
    }

    let result = await QuizAttempt.updateOne({ ...filter, "answers.questionId": questionId }, { $set: { "answers.$.selectedAnswer": selectedAnswer } });
    if (result.matchedCount === 0) {
      result = await QuizAttempt.updateOne(
        { ...filter, "answers.questionId": { $ne: questionId } },
        { $push: { answers: { questionId, selectedAnswer } } }
      );
    }
    if (result.matchedCount === 0) {
      return res.status(409).json({ message: "Attempt is no longer editable" });
    }
    return res.status(200).json({ message: "Answer saved successfully", });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message
    })
  }
}

const submitQuiz = async (req, res) => {
  try {
    const userId = req.user._id;

    const attempt = await QuizAttempt.findOne({
      _id: req.params.attemptId,
      userId,
      status: "in-progress"
    })

    if (!attempt) {
      return res.status(404).json({ message: 'No active quiz attempt found.' });
    }

    const { score, totalQuestions } = await calculateScore(attempt);
    const elapsed = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000
    const maxTime = Number(attempt.duration) * 60;
    attempt.score = score
    attempt.submittedAt = new Date();
    attempt.totalQuestions = totalQuestions
    attempt.status = "submitted"
    attempt.timeTaken = elapsed
    await attempt.save();
    return res.status(201).json({
      message: "Quiz Attempted Succeessfully"
    })
  }

  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message })
  }
}

export { startQuiz, saveAnswer, submitQuiz }