const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      priority,
      progress,
      startDate,
      endDate,
      budget,
      assignedTo
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project name'
      });
    }

    // Create project
    const project = await Project.create({
      name,
      description,
      status: status || 'planning',
      priority: priority || 'medium',
      progress: progress || 0,
      startDate,
      endDate,
      budget,
      assignedTo,
      createdBy: req.user._id
    });

    // Populate references
    await project.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    // Extract and process the request body
    const updateData = { ...req.body };
    
    // Handle assignedTo field - if it's an object, extract just the ID
    if (updateData.assignedTo && typeof updateData.assignedTo === 'object' && updateData.assignedTo._id) {
      updateData.assignedTo = updateData.assignedTo._id;
    }
    
    // Handle createdBy field - if it's an object, extract just the ID
    if (updateData.createdBy && typeof updateData.createdBy === 'object' && updateData.createdBy._id) {
      updateData.createdBy = updateData.createdBy._id;
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private
const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const inProgressProjects = await Project.countDocuments({ status: 'in-progress' });
    const planningProjects = await Project.countDocuments({ status: 'planning' });
    const testingProjects = await Project.countDocuments({ status: 'testing' });
    const onHoldProjects = await Project.countDocuments({ status: 'on-hold' });

    res.status(200).json({
      success: true,
      data: {
        total: totalProjects,
        completed: completedProjects,
        inProgress: inProgressProjects,
        planning: planningProjects,
        testing: testingProjects,
        onHold: onHoldProjects
      }
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
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats
};
