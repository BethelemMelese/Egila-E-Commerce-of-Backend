const Comment = require("../models/comment.model.js");

const getComments = async (req, res) => {
  try {
    const search = req.query.search || "";
    const comments = await Comment.find({
      name: { $regex: search},
    });
    const response = comments.map((value) => {
      return {
        id: value._id,
        name: value.name,
        description: value.description,
        customerId: value.customerId,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id).populate("customerId");

    res.status(200).json({
      id: comment._id,
      name: comment.name,
      description: comment.description,
      customerId: comment.customerId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(200).json({
      id: comment._id,
      name: comment.name,
      description: comment.description,
      customerId: comment.customerId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Comment.findByIdAndUpdate(id, req.body);
    const updatedComment = await Comment.findById(response._id);
    res.status(200).json({
      id: updatedComment._id,
      name: updatedComment.name,
      description: updatedComment.description,
      customerId: updatedComment.customerId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment is not Found !" });
    }

    res.status(200).json({ message: "Comment Deleted Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};
