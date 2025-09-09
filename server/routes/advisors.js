const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { getAIResponse } = require('../services/aiService');

const router = express.Router();

// Chat with advisor
router.post('/:projectId/chat', auth, async (req, res) => {
  try {
    const { advisorRole, message } = req.body;
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get AI response based on advisor role
    const aiResponse = await getAIResponse(advisorRole, message, project);

    // Save interaction
    project.addAdvisorInteraction(
      advisorRole,
      'chat',
      `User: ${message}\nAdvisor: ${aiResponse}`
    );

    // Update advisor memory
    project.advisorMemory[
      advisorRole
    ] += `\nUser: ${message}\nAdvisor: ${aiResponse}`;

    await project.save();

    res.json({
      message: 'Chat response generated',
      response: aiResponse,
      advisorRole,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res
      .status(500)
      .json({ message: 'Error processing chat', error: error.message });
  }
});

// Get structured feedback
router.post('/:projectId/feedback', auth, async (req, res) => {
  try {
    const { advisorRole } = req.body;
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Generate structured feedback based on advisor role
    const feedback = await getStructuredFeedback(advisorRole, project);

    // Save interaction
    project.addAdvisorInteraction(
      advisorRole,
      'structured_feedback',
      JSON.stringify(feedback)
    );

    await project.save();

    res.json({
      message: 'Structured feedback generated',
      feedback,
      advisorRole,
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res
      .status(500)
      .json({ message: 'Error generating feedback', error: error.message });
  }
});

// Add inline comment
router.post('/:projectId/comment', auth, async (req, res) => {
  try {
    const { advisorRole, selectedText, position } = req.body;
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get AI comment on selected text
    const comment = await getInlineComment(advisorRole, selectedText, project);

    // Save interaction
    const interaction = project.addAdvisorInteraction(
      advisorRole,
      'inline_comment',
      comment,
      position
    );

    await project.save();

    res.json({
      message: 'Inline comment added',
      comment,
      interaction: interaction._id,
      advisorRole,
    });
  } catch (error) {
    console.error('Inline comment error:', error);
    res
      .status(500)
      .json({ message: 'Error adding inline comment', error: error.message });
  }
});

// Get advisor interactions
router.get('/:projectId/interactions', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { advisorRole, type } = req.query;

    const project = await Project.findOne({
      _id: projectId,
      userId: req.userId,
    }).select('advisorInteractions');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let interactions = project.advisorInteractions;

    // Filter by advisor role if specified
    if (advisorRole) {
      interactions = interactions.filter(
        (interaction) => interaction.advisorRole === advisorRole
      );
    }

    // Filter by interaction type if specified
    if (type) {
      interactions = interactions.filter(
        (interaction) => interaction.interactionType === type
      );
    }

    res.json({ interactions });
  } catch (error) {
    console.error('Get interactions error:', error);
    res
      .status(500)
      .json({ message: 'Error fetching interactions', error: error.message });
  }
});

// Resolve interaction
router.patch(
  '/:projectId/interactions/:interactionId/resolve',
  auth,
  async (req, res) => {
    try {
      const { projectId, interactionId } = req.params;

      const project = await Project.findOne({
        _id: projectId,
        userId: req.userId,
      });

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const interaction = project.advisorInteractions.id(interactionId);
      if (!interaction) {
        return res.status(404).json({ message: 'Interaction not found' });
      }

      interaction.resolved = true;
      await project.save();

      res.json({ message: 'Interaction resolved successfully' });
    } catch (error) {
      console.error('Resolve interaction error:', error);
      res
        .status(500)
        .json({ message: 'Error resolving interaction', error: error.message });
    }
  }
);

// Helper function to generate structured feedback
async function getStructuredFeedback(advisorRole, project) {
  const prompts = {
    editor: `As a professional editor, provide structured feedback on this ${project.template} project. Focus on story structure, character development, pacing, and overall narrative flow.`,
    copyeditor: `As a copyeditor, provide structured feedback focusing on grammar, style, consistency, and clarity. Check for spelling errors, punctuation, and adherence to style guides.`,
    reader: `As a target reader for this ${
      project.template
    }, provide feedback on engagement, clarity, and appeal. Consider the target audience: ${
      project.targetAudience || 'general audience'
    }.`,
  };

  const feedback = await getAIResponse(
    advisorRole,
    prompts[advisorRole],
    project
  );

  // Structure the feedback into categories
  return {
    overall: feedback,
    categories: {
      strengths: [],
      improvements: [],
      suggestions: [],
    },
    rating: Math.floor(Math.random() * 3) + 3, // Placeholder: 3-5 rating
  };
}

// Helper function to generate inline comments
async function getInlineComment(advisorRole, selectedText, project) {
  const prompts = {
    editor: `As an editor, comment on this specific text passage: "${selectedText}". Consider how it fits within the overall narrative.`,
    copyeditor: `As a copyeditor, review this text for grammar, style, and clarity: "${selectedText}".`,
    reader: `As a reader, comment on this passage: "${selectedText}". Is it engaging and clear?`,
  };

  return await getAIResponse(advisorRole, prompts[advisorRole], project);
}

module.exports = router;
