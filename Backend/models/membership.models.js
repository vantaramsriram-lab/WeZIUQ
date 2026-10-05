import mongoose from "mongoose";
const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true
  },

  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
membershipSchema.index({clubId: 1})
export const Membership = mongoose.model("Membership", membershipSchema);