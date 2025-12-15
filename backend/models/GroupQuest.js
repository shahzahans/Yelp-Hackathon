// models/GroupQuest.js
import mongoose from "mongoose";

const groupQuestSchema = new mongoose.Schema(
  {
    quest: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", required: true },

    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },

    inviteCode: { type: String, unique: true }, // if you want shareable join links

    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const GroupQuest = mongoose.model("GroupQuest", groupQuestSchema);

export { GroupQuest };
export default GroupQuest;