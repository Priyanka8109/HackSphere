const mongoose = require("mongoose");

const hackathonEventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    participants: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    prize: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HackathonEvent", hackathonEventSchema);
