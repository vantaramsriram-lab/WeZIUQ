import { Question } from "../models/question.models.js";
import { User } from "../models/user.models.js";
import { QuizAttempt } from "../models/quizAttempt.models.js";
import quizConfig from "../config/quizDuration.js";
const saveAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body
    const attempt = await QuizAttempt.findById(req.params.attemptId);
    if (!attempt) {
      return res.status(404).json(
        { message: "Attempt not found", }
      );
    }
    if (!attempt.userId.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not authorized to modify this attempt"
      })
    }
    if (attempt.status !== "in-progress") {
      return res.status(403).json({
        message: "Quiz Already Submitted"
      })
    }
    const elapsed = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000;
    const maxTime = quizConfig.QUIZ_DURATION_INMIN * 60;
    if (elapsed > maxTime) {
      return res.status(400).json({
        message: "Time limit Exceeded"
      })
    }
    const existingAnswer = attempt.answers.find(answer => answer.questionId?.toString() === questionId)
    if (existingAnswer) {
      existingAnswer.selectedAnswer = selectedAnswer
    }
    else {
      attempt.answers.push({
        questionId,
        selectedAnswer
      })
    }
    await attempt.save()
    return res.status(200).json({ message: "Answer saved successfully", });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message
    })
  }
}

const startQuiz = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (user.quizCompleted) {
      return res.status(403).json({ message: 'You have already completed the quiz.' })
    }
    const questions = await Question.find({}).select("question options")
    if (questions.length === 0) return res.status(404).json({ message: "No questions Found. Contact Admin" });
    const existingAttempt = await QuizAttempt.findOne({
      userId: user._id,
      status: "in-progress"
    })
    if (existingAttempt) {
      const elapsed = (Date.now() - new Date(existingAttempt.startedAt).getTime()) / 1000;
      const maxTime = quizConfig.QUIZ_DURATION_INMIN * 60;
      if (elapsed > maxTime) {
        existingAttempt.submittedAt = new Date();
        existingAttempt.totalQuestions = questions.length;
        existingAttempt.timeTaken = maxTime;
        existingAttempt.status = "submitted"
        let score = 0;
        const questionsWithAnswer = await Question.find({}).select("_id correctAnswer")
        for (const answer of existingAttempt.answers) {
          const question = questionsWithAnswer.find(question => answer.questionId.toString() === question._id.toString())
          if (question && answer.selectedAnswer === question.correctAnswer) {
            score++;
          }
        }
        existingAttempt.score = score;
        await existingAttempt.save();
        user.quizCompleted = true
        await user.save()
        return res.status(201).json({
          message: "Quiz Submit Successfully"
        })
      }
      return res.json({
        questions,
        attempt: {
          answers: existingAttempt.answers,
          startedAt: existingAttempt.startedAt,
          id: existingAttempt._id
        },
        duration: quizConfig.QUIZ_DURATION_INMIN
      })
    }
    const attempt = await QuizAttempt.create({
      userId: user._id,
      startedAt: new Date()
    })
    res.json({
      questions,
      attempt: {
        answers: [],
        startedAt: attempt.startedAt,
        id: attempt._id
      },
      duration: quizConfig.QUIZ_DURATION_INMIN
    })
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message })
  }
}

const submitQuiz = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.quizCompleted) {
      return res.status(403).json({
        message: "Quiz Already Submitted"
      })
    }
    const attempt = await QuizAttempt.findOne({
      userId: user._id,
      status: "in-progress"
    })
    if (!attempt) {
      return res.status(404).json({ message: 'No active quiz attempt found.' });
    }
    const questionsWithAnswers = await Question.find({}).select("_id correctAnswer");
    const answers = attempt.answers;
    let score = 0;
    for (const answer of answers) {
      const question = questionsWithAnswers.find(question => question._id.toString() === answer.questionId.toString());
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    }
    const elapsed = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000
    const maxTime = quizConfig.QUIZ_DURATION_INMIN * 60;
    attempt.score = score
    attempt.submittedAt = new Date();
    attempt.totalQuestions = questionsWithAnswers.length
    attempt.status = "submitted"
    attempt.timeTaken = Math.min(elapsed, maxTime);
    await attempt.save();
    user.quizCompleted = true;
    await user.save();
    return res.status(201).json({
      message: "Quiz Attempted Succeessfully"
    })
  }
  catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message })
  }
}
export { startQuiz, saveAnswer, submitQuiz }