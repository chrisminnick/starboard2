const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'trial'],
        default: 'trial',
      },
      trialStartDate: {
        type: Date,
        default: Date.now,
      },
      trialEndDate: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    },
    preferences: {
      defaultTemplate: {
        type: String,
        enum: ['novel', 'blog', 'research', 'screenplay', 'custom'],
        default: 'novel',
      },
      autoSaveInterval: {
        type: Number,
        default: 30000, // 30 seconds
      },
      editorTheme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if trial is active
userSchema.methods.isTrialActive = function () {
  return (
    this.subscription.status === 'trial' &&
    new Date() < this.subscription.trialEndDate
  );
};

// Instance method to check if user has access
userSchema.methods.hasAccess = function () {
  return this.subscription.status === 'active' || this.isTrialActive();
};

module.exports = mongoose.model('User', userSchema);
