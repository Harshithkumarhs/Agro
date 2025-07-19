const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
  apartmentId: String,
  houseId: String,
  groceryItems: [{ 
    item: String, 
    quantity: Number,
    cost: {
      type: Number,
      default: 0
    }
  }],
  status: {
    type: String,
    default: 'Pending' // Status can be Pending, Confirmed, or Rejected
  }
});

const GroceryList = mongoose.model('GroceryList', grocerySchema);

module.exports = GroceryList;
