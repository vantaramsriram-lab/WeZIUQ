import { Club } from "../models/club.models.js"
import { Membership } from "../models/membership.models.js";
import { Quiz } from "../models/quiz.models.js";
const getmyClubs = async (req, res) => {
  try {
    const userId = req.user._id;
    const clubdetails = await Membership.find({ userId }).populate("clubId", "clubName clubCode");
    res.status(200).json(clubdetails);
  } catch (error) {
    res.status(500).json({
      message: 'Server error', error: error.message
    })
  }
}
const joinClub = async (req, res) => {
  try {
    const { clubCode } = req.body;
    const club = await Club.findOne({ clubCode: clubCode })
    if (!club) {
      return res.status(400).json({ message: "Check the code again" });
    }
    const clubId = club._id;
    const userId = req.user._id;
    const existingMembership = await Membership.findOne({ clubId, userId });
    if (existingMembership) {
      return res.status(400).json({ message: "Already Joined the club" });
    }
    const membership = await Membership.create({
      userId,
      clubId
    })
    await membership.populate("clubId", "_id clubName clubCode")
    return res.status(201).json({message: "You have joined the club Successfully", membership})
  } catch (error) {
    res.status(500).json({
      message: 'Server error', error: error.message
    })
  }
}
const getClubQuizzes = async (req, res) => {
  try {
    const { clubId } = req.params;
    const quizzes = await Quiz.find({ clubId });
    return res.status(200).json(quizzes)
  } catch (error) {
    res.status(500).json({
      message: 'Server error', error: error.message
    })
  }
}
export { getmyClubs, joinClub, getClubQuizzes };