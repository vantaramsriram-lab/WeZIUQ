import mongoose from "mongoose";
const clubSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
    trim: true
  },

  clubCode: {
    type: String,
    required: true,
    unique: true
  },

  adminIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true
});
export const Club = mongoose.model("Club", clubSchema);