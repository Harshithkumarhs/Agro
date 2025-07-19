const mongoose = require('mongoose');

const totalGrocerySchema = new mongoose.Schema({
  apartmentId: String,
  totalItems: [{
    item: String,
    totalQuantity: Number
  }],
  status: {
    type: String,
    default: 'Pending'
  },
  farmerCost: {
    type: Number,
    default: 0
  },
  logisticsCharges: [{
    logisticsId: String,
    logisticsName: String,
    logisticsPhone: String,
    charge: Number,
    selected: {
      type: Boolean,
      default: false
    }
  }],
  selectedLogistics: {
    logisticsId: String,
    logisticsName: String,
    logisticsPhone: String,
    charge: Number
  }
});

const TotalGrocery = mongoose.model('TotalGrocery', totalGrocerySchema);

module.exports = TotalGrocery;
