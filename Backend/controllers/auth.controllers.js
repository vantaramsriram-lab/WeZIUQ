import { User } from "../models/user.models.js"
import { Club } from "../models/club.models.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Registration successful. Please log in.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({
      email: email,
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: "7d" })

    res.status(200).json({
      message: "Login Succesfull",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error in login contoller', error: error.message });
  }
}
const registerClub = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { clubName, clubCode, adminName, adminEmail, adminPassword } = req.body;
    if (!clubName || !clubCode || !adminEmail || !adminName || !adminPassword) {
      return res.status(400).json({ message: 'All fields are required'});
    }
    const existingClub = await Club.findOne({ clubName, clubCode });
    if (existingClub) {
      return res.status(400).json({ message: 'Club already registered' });
    }
    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "Admin email already registered"
      });
    }
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    // transactions are used when we are performing multiple opertaions
    session.startTransaction()
    const user = await User.create([{
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    }], {session});
     await Club.create([{
      clubName,
      clubCode,
      adminIds: [user[0]._id]
    }], {session});

    //saving everything
    await session.commitTransaction();
    return res.status(201).json({
      message: "Club registered successfully"
    })
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally{
    session.endSession()
  }
}
// check where it will actually help
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
export { login, register, getMe, registerClub }