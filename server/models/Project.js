const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  content: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  version: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    default: '',
  },
});

const advisorInteractionSchema = new mongoose.Schema({
  advisorRole: {
    type: String,
    enum: ['editor', 'copyeditor', 'reader'],
    required: true,
  },
  interactionType: {
    type: String,
    enum: ['chat', 'inline_comment', 'structured_feedback'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  position: {
    start: Number,
    end: Number,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    template: {
      type: String,
      enum: ['novel', 'blog', 'research', 'screenplay', 'custom'],
      default: 'custom',
    },
    genre: {
      type: String,
      trim: true,
    },
    targetAudience: {
      type: String,
      trim: true,
    },
    wordCountGoal: {
      type: Number,
      min: [0, 'Word count goal cannot be negative'],
    },
    content: {
      type: String,
      default: '',
    },
    currentWordCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    versions: [versionSchema],
    advisorInteractions: [advisorInteractionSchema],
    advisorMemory: {
      editor: {
        type: String,
        default: '',
      },
      copyeditor: {
        type: String,
        default: '',
      },
      reader: {
        type: String,
        default: '',
      },
    },
    settings: {
      autoSave: {
        type: Boolean,
        default: true,
      },
      advisorPanelVisible: {
        type: Boolean,
        default: true,
      },
      fontSize: {
        type: Number,
        default: 16,
        min: 12,
        max: 24,
      },
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'completed', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Index for user's projects
projectSchema.index({ userId: 1, updatedAt: -1 });

// Pre-save middleware to update word count
projectSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    this.currentWordCount = this.content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }
  next();
});

// Method to create a new version
projectSchema.methods.createVersion = function (comment = '') {
  const newVersion = {
    content: this.content,
    version: this.versions.length + 1,
    comment: comment,
  };
  this.versions.push(newVersion);
  return newVersion;
};

// Method to add advisor interaction
projectSchema.methods.addAdvisorInteraction = function (
  advisorRole,
  interactionType,
  content,
  position = null
) {
  const interaction = {
    advisorRole,
    interactionType,
    content,
    position,
  };
  this.advisorInteractions.push(interaction);
  return interaction;
};

module.exports = mongoose.model('Project', projectSchema);
