const Comment = require('../models/Comment');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content, projectId } = req.body;

    if (!content || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide comment content and project ID'
      });
    }

    const comment = await Comment.create({
      content,
      projectId,
      userId: req.user._id
    });

    await comment.populate([
      { path: 'userId', select: 'name email' },
      { path: 'projectId', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get comments by project
// @route   GET /api/comments/:projectId
// @access  Private
const getCommentsByProject = async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  getCommentsByProject,
  deleteComment
};
