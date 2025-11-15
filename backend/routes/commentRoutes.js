const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByProject,
  deleteComment
} = require('../controllers/commentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.post('/', createComment);
router.get('/:projectId', getCommentsByProject);
router.delete('/:id', deleteComment);

module.exports = router;
