const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats
} = require('../controllers/projectController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(authMiddleware);

// Routes
router.get('/stats', getProjectStats);
router.route('/')
  .get(getAllProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
