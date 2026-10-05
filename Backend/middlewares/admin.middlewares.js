import { Quiz } from '../models/quiz.models.js'
const authoriseClubAdmin = async (req, res, next) => {
  try {
    const club = req.club;

    if (!club) {
      return res.status(403).json({
        message: "Your are not authorized"
      })
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server Error in clubAdmin",
      error: error.message
    });
  }
}
const authoriseQuizAdmin = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin privileges required." })
    }
    if (!quiz.createdBy.equals(req.user._id)) {
      return res.status(403).json({
        message: "You are not authorized to manage this quiz"
      });
    }
    req.quiz = quiz;
    next()
  } catch (error) {
    return res.status(500).json({
      message: "Server Error in quizAdmin",
      error: error.message
    });
  }
}
export { authoriseQuizAdmin, authoriseClubAdmin }