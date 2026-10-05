import { User } from "../models/user.models.js"
import { Membership } from "../models/membership.models.js"
import { Question } from "../models/question.models.js"
import { QuizAttempt } from "../models/quizAttempt.models.js"
import mongoose from "mongoose"
import { Quiz } from "../models/quiz.models.js"
//Done
const getQuizzes = async (req, res) => {
  try {
    const clubId = req.club._id;
    const quizzes = await Quiz.find({ clubId });
    return res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error in getting quizzes', error: error.message });
  }
}
const createQuiz = async (req, res) => {
  try {
    const clubId = req.club._id;
    const userId = req.user._id;
    const { title, description, duration } = req.body;
    if (!title || !description || !duration) {
      return res.status(400).json({
        message: "All are required fields"
      })
    }
    const quiz = await Quiz.create({
      clubId: clubId, title, description, duration: Number(duration), createdBy: new mongoose.Types.ObjectId(userId)
    })
    return res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error in creating quiz', error: error.message });
  }
}
const getMembers = async (req, res) => {
  try {
    const clubId  = req.club._id;
    const members = await Membership.find({ clubId }).populate({
      path: "userId",
      select: "-password"
    });
    const membersCount = members.length;
    return res.status(200).json({
      members: members,
      membersCount: membersCount
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
const getStatistics = async (req, res) => {
  try {
    const {quizId} = req.params;
    const totalAttempts = await QuizAttempt.countDocuments({ quizId });
    const totalSubmissions = await QuizAttempt.countDocuments({ quizId, status: 'submitted' });
    const totalQuestions = await Question.countDocuments({ quizId });
    res.json({
      totalAttempts,
      totalSubmissions,
      totalQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const { quizId } = req.params;
    const matchStage = { quizId: new mongoose.Types.ObjectId(quizId) };
    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
    ]
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              "user.name": {
                $regex: search,
                $options: "i"
              }
            },
            {
              "user.email": {
                $regex: search,
                $options: "i"
              }
            }
          ]
        }
      })
    }
    pipeline.push(
      {
        $project: {
          userId: "$user._id",
          userName: "$user.name",
          userEmail: "$user.email",
          userCreatedAt: "$user.createdAt",
          status: 1,
        }
      }
    )
    const results = await QuizAttempt.aggregate(pipeline)
    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
const getResults = async (req, res) => {
  try {
    const { search } = req.query;
    const { quizId } = req.params;
    const matchStage = { status: "submitted", quizId: new mongoose.Types.ObjectId(quizId) };
    const pipeline = [
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
    ]
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              "user.name": {
                $regex: search,
                $options: "i"
              }
            },
            {
              "user.email": {
                $regex: search,
                $options: "i"
              }
            }
          ]
        }
      }
      )
    }
    pipeline.push({
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
      })
    const results = await QuizAttempt.aggregate(pipeline)
    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
export { getStatistics, getUsers, getResults, getMembers, createQuiz, getQuizzes }