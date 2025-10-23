import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username must be less than 20 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    profilePicture: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      select: false, // Don't include refresh token in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
      // Transform the document when converting to JSON
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      // Transform the document when converting to plain object
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

// ==================== MIDDLEWARE ====================

// Hash password before saving (pre-save hook)
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt with 12 rounds (good balance between security and performance)
    const salt = await bcrypt.genSalt(12);
    
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastLogin timestamp on login
userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

// ==================== INSTANCE METHODS ====================

// Method to compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Note: 'this.password' will only be available if we explicitly selected it
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to generate a safe user object (without sensitive data)
userSchema.methods.toSafeObject = function () {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.__v;
  
  return userObject;
};

// Method to update last login time
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// Method to check if user is active
userSchema.methods.isAccountActive = function () {
  return this.isActive;
};

// ==================== STATIC METHODS ====================

// Static method to find user by email (with password field)
userSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email }).select('+password +refreshToken');
};

// Static method to find user by username
userSchema.statics.findByUsername = async function (username) {
  return await this.findOne({ username });
};

// Static method to check if email exists
userSchema.statics.emailExists = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

// Static method to check if username exists
userSchema.statics.usernameExists = async function (username) {
  const user = await this.findOne({ username });
  return !!user;
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function () {
  const totalUsers = await this.countDocuments();
  const activeUsers = await this.countDocuments({ isActive: true });
  const inactiveUsers = await this.countDocuments({ isActive: false });
  
  return {
    total: totalUsers,
    active: activeUsers,
    inactive: inactiveUsers,
  };
};

// ==================== QUERY HELPERS ====================

// Query helper to find active users only
userSchema.query.active = function () {
  return this.where({ isActive: true });
};

// Query helper to exclude password and refresh token
userSchema.query.safe = function () {
  return this.select('-password -refreshToken');
};

// ==================== VIRTUAL PROPERTIES ====================

// Virtual property for full display name (can be customized)
userSchema.virtual('displayName').get(function () {
  return this.username;
});

// Virtual property to check if account is new (created within last 7 days)
userSchema.virtual('isNewUser').get(function () {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.createdAt > sevenDaysAgo;
});

// Create and export the model
const User = mongoose.model('User', userSchema);

export default User;
