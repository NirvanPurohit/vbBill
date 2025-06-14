import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true
  },
  
  fullName: {
    type: String, 
    required: true 
  },
  
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  password: { 
    type: String, 
    required: true 
  },
  
  mobile: {
    type: String,
    required: true,
  },
  
  address: {
    type: String
  },
  
  pinCode: {
    type: String,
    required: true,
  },
  
  companyName: {
    type: String,
    required:[true,"Enter Company Name"]
  },
  
  companyGst: {
    type: String,
    required:[true,"Enter GST Number"]
  }, 
  
  refreshToken: {
    type: String
  }

}, 
{ 
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function() {
  const payload = {
    id: this._id,
    username: this.username,
    email: this.email,
    fullName: this.fullName
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' // Default to 1 hour if not defined in env
  });
};

// Method to generate refresh token

userSchema.methods.generateRefreshToken = function() {
  const payload = {
    id: this._id
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' // Default to 7 days if not defined in env
  });
};

// userSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model('User', userSchema);
