import jwt, { decode } from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { Club } from "../models/club.models.js"
const authenticateUser = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split("Bearer ")[1]
    }
    if (!token) {
      return res.status(404).json({ message: "User Not Authorised, no token provided'" })
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await User.findById(decoded._id).select('-password');
    const club = await Club.findOne({ adminIds: user._id }).select("_id clubName");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" })
    }
    req.user = user;
    if (club) {
      req.club = club
    }
    next();
  } catch (err) {
    res.status(500).json({
      message: "Server Erorr in authentication",
      Error: err.message
    })
  }
}
export { authenticateUser }