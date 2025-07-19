const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const logisticsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    default: ''
  },
  capacity: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

// Hash password before saving
logisticsSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Create the model
const Logistics = mongoose.model('Logistics', logisticsSchema);

module.exports = Logistics;
