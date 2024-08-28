const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please insert name"],
    },
    description: {
      type: String,
      required: false,
    },
    customerId: [
      { type: mongoose.Types.ObjectId, ref: "Customer", required: false },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
