import { User } from "../models/user.models.js"
import { Question } from "../models/question.models.js"
import { QuizAttempt } from "../models/quizAttempt.models.js"
const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSubmissions = await QuizAttempt.countDocuments({ status: 'submitted' });
    const totalQuestions = await Question.countDocuments();
    const completedCount = await User.countDocuments({ role: 'user', quizCompleted: true });
    res.json({
      totalUsers,
      totalSubmissions,
      totalQuestions,
      completedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
    }
    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
const getResults = async (req, res) => {
  try {
    const { search } = req.query;
    const matchStage = { status: "submitted" };
    const results = await QuizAttempt.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userName: '$user.name',
          userEmail: '$user.email',
          score: 1,
          totalQuestions: 1,
          startedAt: 1,
          submittedAt: 1,
          timeTaken: 1,
        }
      },
      {
        $sort: { submittedAt: -1 }
      }
    ])
    let filtered = results;
    if (search) {
      const s = search.toLowerCase()
      filtered = results.filter(
        r => r.userName.toLowerCase().includes(s) || r.userEmail.toLowerCase().includes(s)
      )
    }
    res.json(filtered)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
export { getStatistics, getUsers, getResults }