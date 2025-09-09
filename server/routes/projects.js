const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select(
        'title description template status currentWordCount wordCountGoal updatedAt'
      );

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res
      .status(500)
      .json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res
      .status(500)
      .json({ message: 'Error fetching project', error: error.message });
  }
});

// Create new project
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      template,
      genre,
      targetAudience,
      wordCountGoal,
    } = req.body;

    const project = new Project({
      title,
      description,
      template,
      genre,
      targetAudience,
      wordCountGoal,
      userId: req.userId,
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res
      .status(500)
      .json({ message: 'Error creating project', error: error.message });
  }
});

// Update project
router.patch('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create version if content is being updated
    if (req.body.content && req.body.content !== project.content) {
      project.createVersion('Auto-save version');
    }

    // Update project fields
    Object.keys(req.body).forEach((key) => {
      if (project[key] !== undefined || key === 'content') {
        project[key] = req.body[key];
      }
    });

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res
      .status(500)
      .json({ message: 'Error updating project', error: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res
      .status(500)
      .json({ message: 'Error deleting project', error: error.message });
  }
});

// Get project versions
router.get('/:id/versions', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).select('versions');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ versions: project.versions });
  } catch (error) {
    console.error('Get versions error:', error);
    res
      .status(500)
      .json({ message: 'Error fetching versions', error: error.message });
  }
});

// Create manual version
router.post('/:id/versions', auth, async (req, res) => {
  try {
    const { comment } = req.body;
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const version = project.createVersion(comment || 'Manual version');
    await project.save();

    res.status(201).json({
      message: 'Version created successfully',
      version,
    });
  } catch (error) {
    console.error('Create version error:', error);
    res
      .status(500)
      .json({ message: 'Error creating version', error: error.message });
  }
});

// Export project
router.get('/:id/export/:format', auth, async (req, res) => {
  try {
    const { format } = req.params;
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let contentType, filename, content;

    switch (format) {
      case 'markdown':
        contentType = 'text/markdown';
        filename = `${project.title}.md`;
        content = project.content;
        break;
      case 'txt':
        contentType = 'text/plain';
        filename = `${project.title}.txt`;
        content = project.content.replace(/<[^>]*>/g, ''); // Strip HTML tags
        break;
      default:
        return res.status(400).json({ message: 'Unsupported export format' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  } catch (error) {
    console.error('Export project error:', error);
    res
      .status(500)
      .json({ message: 'Error exporting project', error: error.message });
  }
});

module.exports = router;
