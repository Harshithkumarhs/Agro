require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const cors = require('cors');
const GroceryList = require('./models/GroceryList');
const TotalGrocery = require('./models/TotalGrocery');
const Consumer=require("./models/signinConsumer");
const Farmer=require("./models/signinFarmer");
const Logistics=require("./models/signinLogistics");
const bcrypt = require('bcrypt');

const app = express();
app.use(cors()); // Enable CORS for React frontend
app.use(bodyParser.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(bodyParser.json()); // To parse JSON data

app.set('view engine', 'ejs');
app.set('views', './views'); // Ensure the `views` directory exists
// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log("✅ MongoDB Atlas connected successfully");
})
.catch((err) => {
  console.error("❌ MongoDB Atlas connection failed:", err);
});


app.get("/", (req, res) => {
  res.render("index");
})


app.post("/submit-role", (req, res) => {
  const selectedRole = req.body.role; // Get the role from the form submission

  // Redirect to the corresponding login page based on the selected role
  if (selectedRole === "consumer") {
    res.redirect("/signinConsumer");
  } else if (selectedRole === "logistics") {
    res.redirect("/signinLogistics");
  } else if (selectedRole === "farmer") {
    res.redirect("/signinFarmer");
  }
});


app.get("/signinConsumer", async (req, res) => {
  res.render("signinConsumer");
})

app.post("/signinConsumer", async (req, res) => {

  const { name, phone, apartment, password } = req.body;

  const consumer = new Consumer({
    name,
    phone,
    apartment,
    password,
  });

  await consumer.save();

  res.redirect("/submit-grocery");
})

app.get("/loginConsumer", async (req, res) => {
  res.render("loginConsumer");
})

app.post("/loginConsumer", async (req, res) => {
  const { name, phone, apartment, password } = req.body;

  try {
    // Find the consumer based on the phone number
    const consumer = await Consumer.findOne({ phone });

    if (!consumer) {
      // If the consumer doesn't exist, send an error response
      return res.status(400).render('loginConsumer', {
        errorMessage: 'No account found with that phone number.'
      });
    }

    // Check if the password matches the hashed password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, consumer.password);

    if (!isPasswordMatch) {
      // If the password doesn't match, send an error response
      return res.status(400).render('loginConsumer', {
        errorMessage: 'Incorrect password.'
      });
    }

    // If login is successful, redirect to a dashboard or home page
    res.redirect('/submit-grocery'); // Redirect to the consumer dashboard or desired page
  } catch (err) {
    // Handle any errors that occur during the process
    console.error(err);
    res.status(500).render('loginConsumer', {
      errorMessage: 'An error occurred. Please try again later.'
    });
  }
});


app.get("/signinFarmer", async (req, res) => {
  res.render("signinFarmer");
})

app.post("/signinFarmer", async (req, res) => {
  const { name, password } = req.body;
  const farmer = new Farmer({
    name,
    password,
  });

  await farmer.save();
  res.redirect("/generate-total-grocery");
})

app.get("/loginFarmer",async (req, res) => {
  res.render("loginFarmer");
})

app.post("/loginFarmer", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Find the farmer by name
    const farmer = await Farmer.findOne({ name });

    if (!farmer) {
      // If the farmer doesn't exist, send an error response
      return res.status(400).render('loginFarmer', {
        errorMessage: 'No account found with that name.'
      });
    }

    // Check if the entered password matches the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, farmer.password);

    if (!isPasswordMatch) {
      // If the password doesn't match, send an error response
      return res.status(400).render('loginFarmer', {
        errorMessage: 'Incorrect password.'
      });
    }

    // If login is successful, redirect to the farmer's dashboard or desired page
    res.redirect("/generate-total-grocery"); // Redirect to the farmer dashboard or any other page
  } catch (err) {
    // Handle any errors that occur during the login process
    console.error(err);
    res.status(500).render('loginFarmer', {
      errorMessage: 'An error occurred. Please try again later.'
    });
  }
});



app.get("/signinLogistics",async (req, res) => {
  res.render("signinLogistics");
})

app.post("/signinLogistics", async (req, res) => {

  const { name, phone, location, password } = req.body;
  const logistics = new Logistics({
    name,
    phone,
    location,
    password
  });

  await logistics.save();

  res.redirect("/generate-total-grocery");
})


app.get("/loginLogistics",async (req, res) => {
  res.render("loginLogistics");
})

app.post("/loginLogistics", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Find the logistics by name
    const logistics = await Logistics.findOne({ name });

    if (!logistics) {
      // If no logistics are found with that name, show an error message
      return res.status(400).render('loginLogistics', {
        errorMessage: 'No account found with that name.'
      });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, logistics.password);

    if (!isPasswordMatch) {
      // If the password doesn't match, show an error message
      return res.status(400).render('loginLogistics', {
        errorMessage: 'Incorrect password.'
      });
    }

    // If login is successful, redirect to the logistics dashboard or any other page
    res.redirect("/generate-total-grocery"); // Redirect to the logistics dashboard
  } catch (err) {
    // Handle any errors that occur during the login process
    console.error(err);
    res.status(500).render('loginLogistics', {
      errorMessage: 'An error occurred. Please try again later.'
    });
  }
});









app.get("/submit-grocery",async (req, res) => {
  res.render("grossery");
})



app.post('/submit-grocery', async (req, res) => {
  try {
    const { apartmentId, houseId, groceryItems } = req.body;

    // Check if groceryItems is an array
    if (!Array.isArray(groceryItems)) {
      return res.status(400).json({ error: 'Invalid grocery items format.' });
    }

    // Parse the groceryItems (you may already have them as an array, so this might not be necessary)
    groceryItems.forEach((item) => {
      if (item.quantity) {
        item.quantity = parseInt(item.quantity, 10);  // Convert quantity to number
      }
    });

    // Ensure apartmentId and houseId are provided
    if (!apartmentId || !houseId) {
      return res.status(400).json({ error: 'Invalid data. Please check your input.' });
    }

    // Create a new GroceryList document
    const newGroceryList = new GroceryList({
      apartmentId,
      houseId,
      groceryItems,
    });

    // Save the document to the database
    await newGroceryList.save();

    res.redirect("/submit-grocery");
  } catch (error) {
    console.error('Error saving grocery list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to generate and send total grocery list to farmers
app.get('/generate-total-grocery', async (req, res) => {
  try {
    // Fetch all grocery lists from the database
    const groceryLists = await GroceryList.find();

    // Aggregate total grocery items for each apartment
    const aggregatedData = {};

    groceryLists.forEach(list => {
      const apartmentId = list.apartmentId;

      // Initialize if apartment not in the aggregated data
      if (!aggregatedData[apartmentId]) {
        aggregatedData[apartmentId] = [];
      }

      // Aggregate items for the current apartment
      list.groceryItems.forEach(item => {
        const existingItem = aggregatedData[apartmentId].find(t => t.item === item.item);
        if (existingItem) {
          existingItem.totalQuantity += item.quantity;
          existingItem.totalCost = (existingItem.totalCost || 0) + (item.cost || 0);
        } else {
          aggregatedData[apartmentId].push({
            item: item.item,
            totalQuantity: item.quantity,
            totalCost: item.cost || 0
          });
        }
      });
    });

    // Send total grocery list for each apartment to farmers
    const farmersPhoneNumbers = ['+918867337907']; // Replace with actual farmer numbers

    for (const apartmentId in aggregatedData) {
      const totalItems = aggregatedData[apartmentId];
      const message = `Grocery list for apartment ${apartmentId}: ${JSON.stringify(totalItems)}`;

      // Send SMS to farmers
      farmersPhoneNumbers.forEach(phoneNumber => {
        client.messages.create({
          body: message,
          from: '+16504144480', // Replace with your Twilio number
          to: phoneNumber
        }).then(message => console.log(`Message sent to ${phoneNumber}: ${message.sid}`));
      });

      // Save aggregated grocery data into the TotalGrocery collection
      let totalGrocery = await TotalGrocery.findOne({ apartmentId });

      if (!totalGrocery) {
        // If not found, create a new entry
        totalGrocery = new TotalGrocery({
          apartmentId,
          totalItems,
          status: 'Pending'  // Set default status to 'Pending'
        });
      } else {
        // If found, update the existing entry with the new totalItems
        totalGrocery.totalItems = totalItems;
      }

      // Save the updated or newly created document in the database
      await totalGrocery.save();
      console.log(`Total grocery data saved for apartment ${apartmentId}`);
    }

    // Send aggregated data to EJS for display
    res.render('total-grocery', { aggregatedData });

  } catch (error) {
    console.error('Error generating total grocery list:', error);
    res.status(500).send('Internal server error');
  }
});






// Endpoint for farmers to confirm if they can supply the groceries
app.post('/confirm-farmer/:apartmentId', async (req, res) => {
  const { apartmentId } = req.params;  // Capturing apartmentId from the URL
  const { canSupply } = req.body;  // Capturing the confirmation (true/false) from the form
  console.log(apartmentId);
  try {
    // Find the total grocery list for the apartment
    const totalGrocery = await TotalGrocery.findOne({ apartmentId: String(apartmentId) });
    console.log(totalGrocery);
    // Update the status based on whether the farmer can supply or not
    if (canSupply) {
      totalGrocery.status = 'Confirmed';
    } else {
      totalGrocery.status = 'Rejected';
    }

    // Save the updated status to the database
    await totalGrocery.save();

    // Define the logistics phone numbers
    const logisticsPhoneNumbers = ['+918867337907'];  // Replace with actual logistics numbers
    const message = `The grocery list for apartment ${apartmentId} has been ${totalGrocery.status}.`;

    // Send SMS to logistics
    for (const phoneNumber of logisticsPhoneNumbers) {
      await client.messages.create({
        body: message,
        from: '+16504144480',  // Replace with your Twilio phone number
        to: phoneNumber
      });

      console.log(`Message sent to logistics: ${message}`);
    }

    const groceryLists = await GroceryList.find();

  // Aggregate total grocery items for each apartment
  const aggregatedData = {};

  groceryLists.forEach(list => {
    const apartmentId = list.apartmentId;

    // Initialize if apartment not in the aggregated data
    if (!aggregatedData[apartmentId]) {
      aggregatedData[apartmentId] = [];
    }

    // Aggregate items for the current apartment
    list.groceryItems.forEach(item => {
      const existingItem = aggregatedData[apartmentId].find(t => t.item === item.item);
      if (existingItem) {
        existingItem.totalQuantity += item.quantity;
        existingItem.totalCost = (existingItem.totalCost || 0) + (item.cost || 0);
      } else {
        aggregatedData[apartmentId].push({
          item: item.item,
          totalQuantity: item.quantity,
          totalCost: item.cost || 0
        });
      }
    });
  });


  res.render("total-grocery",{aggregatedData});

  } catch (error) {
    // Handle any errors
    console.error('Error processing farmer confirmation:', error);
    res.status(500).send('Error updating confirmation and sending message');
  }
});






app.get('/send-logistics-charge/:apartmentId', (req, res) => {
  const { apartmentId } = req.params;  // Capture apartmentId from the URL

  // Optionally set response message and color based on query parameters
  const responseMessage = req.query.successMessage || null;
  const responseColor = req.query.responseColor || 'green';  // Default to 'green'

  // Send apartmentId along with the responseMessage and responseColor to the EJS view
  res.render('logisticsForm', { apartmentId, responseMessage, responseColor });
});


// Endpoint to send logistics charge info to customers
app.post('/confirm-logistics/:apartmentId', async (req, res) => {
  const { apartmentId, logisticsCharge } = req.body;

  // Get customer phone numbers for the apartment
  const customersPhoneNumbers = ['+918867337907']; // List of customer phone numbers

  const message = `The logistics charge for your grocery order in apartment ${apartmentId} is ${logisticsCharge}`;

  customersPhoneNumbers.forEach(phoneNumber => {
    client.messages.create({
      body: message,
      from: '+16504144480',
      to: phoneNumber
    }).then(message => console.log(message.sid));
  });



  const groceryLists = await GroceryList.find();

  // Aggregate total grocery items for each apartment
  const aggregatedData = {};

  groceryLists.forEach(list => {
    const apartmentId = list.apartmentId;

    // Initialize if apartment not in the aggregated data
    if (!aggregatedData[apartmentId]) {
      aggregatedData[apartmentId] = [];
    }

    // Aggregate items for the current apartment
    list.groceryItems.forEach(item => {
      const existingItem = aggregatedData[apartmentId].find(t => t.item === item.item);
      if (existingItem) {
        existingItem.totalQuantity += item.quantity;
      } else {
        aggregatedData[apartmentId].push({
          item: item.item,
          totalQuantity: item.quantity
        });
      }
    });
  });


  res.render("total-grocery",{aggregatedData});
});

// API Endpoints for React Frontend
// Consumer signin API
app.post('/api/signinConsumer', async (req, res) => {
  try {
    const { name, phone, apartment, password } = req.body;
    
    const consumer = new Consumer({
      name,
      phone,
      apartment,
      password,
    });

    await consumer.save();
    res.status(200).json({ message: 'Consumer registered successfully', consumer });
  } catch (error) {
    console.error('Error in consumer signin:', error);
    res.status(500).json({ errorMessage: 'An error occurred during registration' });
  }
});

// Consumer login API
app.post('/api/loginConsumer', async (req, res) => {
  try {
    const { name, phone, apartment, password } = req.body;

    const consumer = await Consumer.findOne({ phone });

    if (!consumer) {
      return res.status(400).json({ errorMessage: 'No account found with that phone number.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, consumer.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ errorMessage: 'Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful', consumer });
  } catch (error) {
    console.error('Error in consumer login:', error);
    res.status(500).json({ errorMessage: 'An error occurred. Please try again later.' });
  }
});

// Farmer signin API
app.post('/api/signinFarmer', async (req, res) => {
  try {
    const { name, password } = req.body;
    
    const farmer = new Farmer({
      name,
      password,
    });

    await farmer.save();
    res.status(200).json({ message: 'Farmer registered successfully', farmer });
  } catch (error) {
    console.error('Error in farmer signin:', error);
    res.status(500).json({ errorMessage: 'An error occurred during registration' });
  }
});

// Farmer login API
app.post('/api/loginFarmer', async (req, res) => {
  try {
    const { name, password } = req.body;

    const farmer = await Farmer.findOne({ name });

    if (!farmer) {
      return res.status(400).json({ errorMessage: 'No account found with that name.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, farmer.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ errorMessage: 'Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful', farmer });
  } catch (error) {
    console.error('Error in farmer login:', error);
    res.status(500).json({ errorMessage: 'An error occurred. Please try again later.' });
  }
});

// Logistics signin API
app.post('/api/signinLogistics', async (req, res) => {
  try {
    const { name, phone, location, password } = req.body;
    
    const logistics = new Logistics({
      name,
      phone,
      location,
      password,
    });

    await logistics.save();
    res.status(200).json({ message: 'Logistics partner registered successfully', logistics });
  } catch (error) {
    console.error('Error in logistics signin:', error);
    res.status(500).json({ errorMessage: 'An error occurred during registration' });
  }
});

// Logistics login API
app.post('/api/loginLogistics', async (req, res) => {
  try {
    const { name, password } = req.body;

    const logistics = await Logistics.findOne({ name });

    if (!logistics) {
      return res.status(400).json({ errorMessage: 'No account found with that name.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, logistics.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ errorMessage: 'Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful', logistics });
  } catch (error) {
    console.error('Error in logistics login:', error);
    res.status(500).json({ errorMessage: 'An error occurred. Please try again later.' });
  }
});

// Submit grocery API
app.post('/api/submit-grocery', async (req, res) => {
  try {
    const { apartmentId, houseId, groceryItems } = req.body;

    const groceryList = new GroceryList({
      apartmentId,
      houseId,
      groceryItems
    });

    await groceryList.save();
    res.status(200).json({ message: 'Grocery list submitted successfully', groceryList });
  } catch (error) {
    console.error('Error submitting grocery:', error);
    res.status(500).json({ errorMessage: 'An error occurred while submitting grocery list' });
  }
});

// Calculate and send to farmers API
app.post('/api/calculate-grocery', async (req, res) => {
  try {
    // Fetch all grocery lists from the database
    const groceryLists = await GroceryList.find();

    // Aggregate total grocery items for each apartment
    const aggregatedData = {};

    groceryLists.forEach(list => {
      const apartmentId = list.apartmentId;

      // Initialize if apartment not in the aggregated data
      if (!aggregatedData[apartmentId]) {
        aggregatedData[apartmentId] = [];
      }

      // Aggregate items for the current apartment
      list.groceryItems.forEach(item => {
        const existingItem = aggregatedData[apartmentId].find(t => t.item === item.item);
        if (existingItem) {
          existingItem.totalQuantity += item.quantity;
        } else {
          aggregatedData[apartmentId].push({
            item: item.item,
            totalQuantity: item.quantity
          });
        }
      });
    });

    // Send total grocery list for each apartment to farmers
    const farmersPhoneNumbers = [process.env.TEST_FARMER_PHONE]; // Replace with actual farmer numbers

    for (const apartmentId in aggregatedData) {
      const totalItems = aggregatedData[apartmentId];
      const message = `New grocery request for apartment ${apartmentId}: ${JSON.stringify(totalItems)}. Please check your dashboard to confirm supply.`;

      // Send SMS to farmers
      farmersPhoneNumbers.forEach(phoneNumber => {
        client.messages.create({
          body: message,
          from: twilioPhoneNumber,
          to: phoneNumber
        }).then(message => console.log(`Message sent to ${phoneNumber}: ${message.sid}`));
      });

      // Save aggregated grocery data into the TotalGrocery collection
      let totalGrocery = await TotalGrocery.findOne({ apartmentId });

      if (!totalGrocery) {
        // If not found, create a new entry
        totalGrocery = new TotalGrocery({
          apartmentId,
          totalItems,
          status: 'Pending'
        });
      } else {
        // If found, update the existing entry with the new totalItems
        totalGrocery.totalItems = totalItems;
        totalGrocery.status = 'Pending';
        totalGrocery.farmerCost = 0;
        totalGrocery.logisticsCharges = [];
        totalGrocery.selectedLogistics = null;
      }

      // Save the updated or newly created document in the database
      await totalGrocery.save();
      console.log(`Total grocery data saved for apartment ${apartmentId}`);
    }

    res.status(200).json({ 
      message: 'Grocery calculation completed and sent to farmers',
      aggregatedData 
    });
  } catch (error) {
    console.error('Error calculating grocery:', error);
    res.status(500).json({ errorMessage: 'An error occurred while calculating grocery' });
  }
});

// Get total grocery API
app.get('/api/total-grocery', async (req, res) => {
  try {
    const groceryLists = await GroceryList.find();
    const aggregatedData = {};

    groceryLists.forEach(list => {
      const apartmentId = list.apartmentId;

      if (!aggregatedData[apartmentId]) {
        aggregatedData[apartmentId] = [];
      }

      list.groceryItems.forEach(item => {
        const existingItem = aggregatedData[apartmentId].find(t => t.item === item.item);
        if (existingItem) {
          existingItem.totalQuantity += item.quantity;
        } else {
          aggregatedData[apartmentId].push({
            item: item.item,
            totalQuantity: item.quantity
          });
        }
      });
    });

    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error('Error getting total grocery:', error);
    res.status(500).json({ errorMessage: 'An error occurred while fetching grocery data' });
  }
});

// Get grocery items for search
app.get('/api/grocery-items', async (req, res) => {
  try {
    const items = await GroceryList.find().sort({ item: 1 });
    
    // Add mock data for demonstration
    const mockItems = [
      { item: 'Fresh Tomatoes', category: 'vegetables', cost: 2.50, quantity: 100 },
      { item: 'Organic Milk', category: 'dairy', cost: 3.99, quantity: 50 },
      { item: 'Whole Grain Bread', category: 'bakery', cost: 4.25, quantity: 75 },
      { item: 'Free Range Eggs', category: 'dairy', cost: 5.50, quantity: 60 },
      { item: 'Fresh Spinach', category: 'vegetables', cost: 2.99, quantity: 80 },
      { item: 'Apples', category: 'fruits', cost: 1.99, quantity: 120 },
      { item: 'Bananas', category: 'fruits', cost: 0.99, quantity: 200 },
      { item: 'Chicken Breast', category: 'poultry', cost: 8.99, quantity: 40 },
      { item: 'Salmon Fillet', category: 'seafood', cost: 12.99, quantity: 30 },
      { item: 'Brown Rice', category: 'grains', cost: 3.49, quantity: 90 },
      { item: 'Quinoa', category: 'grains', cost: 6.99, quantity: 45 },
      { item: 'Orange Juice', category: 'beverages', cost: 4.50, quantity: 70 },
      { item: 'Greek Yogurt', category: 'dairy', cost: 4.99, quantity: 55 },
      { item: 'Carrots', category: 'vegetables', cost: 1.49, quantity: 150 },
      { item: 'Broccoli', category: 'vegetables', cost: 2.99, quantity: 85 },
      { item: 'Strawberries', category: 'fruits', cost: 4.99, quantity: 65 },
      { item: 'Ground Beef', category: 'meat', cost: 7.99, quantity: 35 },
      { item: 'Pork Chops', category: 'meat', cost: 9.99, quantity: 25 },
      { item: 'Tilapia', category: 'seafood', cost: 6.99, quantity: 40 },
      { item: 'Whole Wheat Pasta', category: 'grains', cost: 2.99, quantity: 100 },
      { item: 'Almond Milk', category: 'beverages', cost: 3.99, quantity: 60 },
      { item: 'Granola Bars', category: 'snacks', cost: 3.49, quantity: 80 },
      { item: 'Olive Oil', category: 'condiments', cost: 8.99, quantity: 45 },
      { item: 'Balsamic Vinegar', category: 'condiments', cost: 5.99, quantity: 50 }
    ];
    
    // Combine database items with mock items
    const allItems = [...items, ...mockItems];
    
    res.status(200).json(allItems);
  } catch (error) {
    console.error('Error fetching grocery items:', error);
    res.status(500).json({ errorMessage: 'An error occurred while fetching items' });
  }
});

// Logistics form API
app.post('/api/logistics-form', async (req, res) => {
  try {
    const { name, phone, location, vehicleType, capacity } = req.body;
    
    // Here you would typically save this to a logistics form collection
    // For now, we'll just return success
    res.status(200).json({ message: 'Logistics form submitted successfully' });
  } catch (error) {
    console.error('Error submitting logistics form:', error);
    res.status(500).json({ errorMessage: 'An error occurred while submitting logistics form' });
  }
});

// Get logistics dashboard data
app.get('/api/logistics-dashboard', async (req, res) => {
  try {
    const confirmedOrders = await TotalGrocery.find({ 
      status: 'Confirmed',
      'logisticsCharges.0': { $exists: false } // Only orders without logistics charges
    });
    
    res.status(200).json(confirmedOrders);
  } catch (error) {
    console.error('Error fetching logistics dashboard:', error);
    res.status(500).json({ errorMessage: 'An error occurred while fetching logistics data' });
  }
});

// Add logistics charge
app.post('/api/add-logistics-charge/:apartmentId', async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const { logisticsId, logisticsName, logisticsPhone, charge } = req.body;

    const totalGrocery = await TotalGrocery.findOne({ apartmentId: String(apartmentId) });

    if (!totalGrocery) {
      return res.status(404).json({ errorMessage: 'Order not found' });
    }

    if (totalGrocery.status !== 'Confirmed') {
      return res.status(400).json({ errorMessage: 'Order is not confirmed by farmer' });
    }

    // Add logistics charge
    totalGrocery.logisticsCharges.push({
      logisticsId,
      logisticsName,
      logisticsPhone,
      charge: Number(charge),
      selected: false
    });

    await totalGrocery.save();

    // Send SMS to consumers
    const consumersPhoneNumbers = [process.env.TEST_CONSUMER_PHONE]; // Replace with actual consumer numbers
    const message = `New logistics option available for apartment ${apartmentId}. Charge: $${charge}. Check your dashboard to select.`;

    let smsSent = false;
    for (const phoneNumber of consumersPhoneNumbers) {
      try {
        await client.messages.create({
          body: message,
          from: twilioPhoneNumber,
          to: phoneNumber
        });
        smsSent = true;
        break;
      } catch (smsErr) {
        console.error('Error sending SMS:', smsErr);
      }
    }

    res.status(200).json({ 
      message: 'Logistics charge added successfully',
      smsSent: smsSent
    });

  } catch (error) {
    console.error('Error adding logistics charge:', error);
    res.status(500).json({ errorMessage: 'An error occurred while adding logistics charge' });
  }
});

// Get consumer dashboard data
app.get('/api/consumer-dashboard', async (req, res) => {
  try {
    const orders = await TotalGrocery.find({ 
      status: 'Confirmed',
      'logisticsCharges.0': { $exists: true } // Only orders with logistics charges
    });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching consumer dashboard:', error);
    res.status(500).json({ errorMessage: 'An error occurred while fetching consumer data' });
  }
});

// Select logistics partner
app.post('/api/select-logistics/:apartmentId', async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const { logisticsId } = req.body;

    const totalGrocery = await TotalGrocery.findOne({ apartmentId: String(apartmentId) });

    if (!totalGrocery) {
      return res.status(404).json({ errorMessage: 'Order not found' });
    }

    // Find the selected logistics
    const selectedLogistics = totalGrocery.logisticsCharges.find(
      logistics => logistics.logisticsId === logisticsId
    );

    if (!selectedLogistics) {
      return res.status(404).json({ errorMessage: 'Logistics partner not found' });
    }

    // Update selection
    totalGrocery.logisticsCharges.forEach(logistics => {
      logistics.selected = logistics.logisticsId === logisticsId;
    });

    totalGrocery.selectedLogistics = {
      logisticsId: selectedLogistics.logisticsId,
      logisticsName: selectedLogistics.logisticsName,
      logisticsPhone: selectedLogistics.logisticsPhone,
      charge: selectedLogistics.charge
    };

    await totalGrocery.save();

    // Send SMS to selected logistics partner
    const message = `You have been selected for apartment ${apartmentId} order. Total cost: $${totalGrocery.farmerCost + selectedLogistics.charge}. Please contact the consumer.`;

    let smsSent = false;
    try {
      await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: selectedLogistics.logisticsPhone
      });
      smsSent = true;
    } catch (smsErr) {
      console.error('Error sending SMS:', smsErr);
    }

    res.status(200).json({ 
      message: 'Logistics partner selected successfully',
      selectedLogistics: totalGrocery.selectedLogistics,
      smsSent: smsSent
    });

  } catch (error) {
    console.error('Error selecting logistics:', error);
    res.status(500).json({ errorMessage: 'An error occurred while selecting logistics' });
  }
});

// Farmer confirmation API with improved error handling
app.post('/api/confirm-farmer/:apartmentId', async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const { canSupply, farmerCost } = req.body;

    // Find the total grocery list for the apartment
    const totalGrocery = await TotalGrocery.findOne({ apartmentId: String(apartmentId) });

    if (!totalGrocery) {
      return res.status(404).json({ errorMessage: 'Grocery list not found for this apartment' });
    }

    // Update the status based on whether the farmer can supply or not
    if (canSupply) {
      totalGrocery.status = 'Confirmed';
      totalGrocery.farmerCost = farmerCost || 0;
    } else {
      totalGrocery.status = 'Rejected';
      totalGrocery.farmerCost = 0;
    }

    // Save the updated status to the database
    await totalGrocery.save();

    // Try to send SMS to logistics (with error handling)
    const logisticsPhoneNumbers = [process.env.TEST_LOGISTICS_PHONE]; // Replace with actual logistics numbers
    const message = canSupply 
      ? `New confirmed grocery order for apartment ${apartmentId}. Farmer cost: $${farmerCost}. Please check your dashboard to add logistics charges.`
      : `Grocery order for apartment ${apartmentId} has been rejected by farmer.`;

    let smsSent = false;
    let smsError = null;

    for (const phoneNumber of logisticsPhoneNumbers) {
      try {
        await client.messages.create({
          body: message,
          from: twilioPhoneNumber,
          to: phoneNumber
        });
        console.log(`Message sent to logistics: ${message}`);
        smsSent = true;
        break; // Exit loop if SMS sent successfully
      } catch (smsErr) {
        console.error('Error sending SMS:', smsErr);
        smsError = smsErr.message;
        // Continue with the process even if SMS fails
      }
    }

    // Always return success if database update was successful
    res.status(200).json({ 
      message: `Successfully ${canSupply ? 'confirmed' : 'rejected'} grocery list for apartment ${apartmentId}`,
      status: totalGrocery.status,
      farmerCost: totalGrocery.farmerCost,
      smsSent: smsSent,
      smsError: smsError
    });

  } catch (error) {
    console.error('Error processing farmer confirmation:', error);
    res.status(500).json({ errorMessage: 'Error updating confirmation in database' });
  }
});

// Simple Twilio credentials test
app.get('/api/test-twilio-credentials', async (req, res) => {
  try {
    // Just test if we can create a Twilio client without errors
    const testClient = twilio(accountSid, authToken);
    
    res.status(200).json({ 
      message: 'Twilio credentials are valid',
      accountSid: accountSid ? 'Present' : 'Missing',
      authToken: authToken ? 'Present' : 'Missing'
    });
  } catch (error) {
    console.error('Twilio credentials test failed:', error);
    res.status(500).json({ 
      errorMessage: 'Twilio credentials are invalid', 
      error: error.message
    });
  }
});

// Test Twilio setup
app.get('/api/test-twilio', async (req, res) => {
  try {
    // Test Twilio credentials by trying to send a test message
    const testMessage = await client.messages.create({
      body: 'Test message from FarmConnect - Twilio is working!',
      from: twilioPhoneNumber,
      to: process.env.TEST_FARMER_PHONE // Replace with your test number
    });
    
    res.status(200).json({ 
      message: 'Twilio test successful', 
      messageSid: testMessage.sid,
      status: testMessage.status
    });
  } catch (error) {
    console.error('Twilio test failed:', error);
    res.status(500).json({ 
      errorMessage: 'Twilio test failed', 
      error: error.message,
      code: error.code
    });
  }
});

// Update user profile API
app.put('/api/update-profile', async (req, res) => {
  try {
    const { name, phone, apartment, email, address } = req.body;
    
    // For now, we'll update the user in localStorage
    // In a real app, you'd update the database
    const userData = {
      name,
      phone,
      apartment,
      email,
      address,
      updatedAt: new Date()
    };
    
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: userData 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ errorMessage: 'An error occurred while updating profile' });
  }
});

// Get user orders for tracking
app.get('/api/user-orders', async (req, res) => {
  try {
    const orders = await TotalGrocery.find().sort({ createdAt: -1 });
    
    // If no orders exist, create a mock delivered order for testing
    if (orders.length === 0) {
      const mockOrder = new TotalGrocery({
        apartmentId: 'Apt-101',
        totalItems: [
          { item: 'Fresh Tomatoes', totalQuantity: 5 },
          { item: 'Organic Milk', totalQuantity: 2 }
        ],
        status: 'Delivered',
        farmerCost: 45.50,
        selectedLogistics: {
          logisticsId: 'logistics-001',
          logisticsName: 'Fast Delivery Co.',
          logisticsPhone: '+1234567890',
          charge: 10.00
        }
      });
      await mockOrder.save();
      orders.push(mockOrder);
    }
    
    // Add mock timeline data for demonstration
    const ordersWithTimeline = orders.map(order => ({
      ...order.toObject(),
      farmerConfirmedAt: order.status === 'Confirmed' ? new Date(Date.now() - 86400000) : null,
      logisticsSelectedAt: order.selectedLogistics ? new Date(Date.now() - 43200000) : null,
      inTransitAt: order.status === 'In Progress' ? new Date(Date.now() - 21600000) : null,
      deliveredAt: order.status === 'Delivered' ? new Date() : null
    }));
    
    res.status(200).json(ordersWithTimeline);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ errorMessage: 'An error occurred while fetching orders' });
  }
});

// Analytics API
app.get('/api/analytics', async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    
    // Mock analytics data
    const analytics = {
      totalOrders: 156,
      orderGrowth: 12.5,
      totalRevenue: 28450.75,
      revenueGrowth: 8.3,
      activeUsers: 89,
      userGrowth: 15.2,
      averageRating: 4.6,
      ratingCount: 234,
      completionRate: 0.94,
      satisfactionRate: 0.92,
      avgDeliveryTime: 2.5,
      returnRate: 0.03,
      topItems: [
        { name: 'Fresh Tomatoes', category: 'Vegetables', quantity: 45, revenue: 225.00 },
        { name: 'Organic Milk', category: 'Dairy', quantity: 38, revenue: 190.00 },
        { name: 'Whole Grain Bread', category: 'Bakery', quantity: 32, revenue: 128.00 },
        { name: 'Free Range Eggs', category: 'Dairy', quantity: 28, revenue: 140.00 },
        { name: 'Fresh Spinach', category: 'Vegetables', quantity: 25, revenue: 125.00 }
      ]
    };
    
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ errorMessage: 'An error occurred while fetching analytics' });
  }
});

// Submit logistics rating
app.post('/api/submit-rating', async (req, res) => {
  try {
    const { orderId, logisticsId, overallRating, categoryRatings, review, ratingDate } = req.body;
    
    // Create rating object
    const rating = {
      orderId,
      logisticsId,
      overallRating,
      categoryRatings,
      review,
      ratingDate,
      customerId: req.body.customerId || 'anonymous',
      createdAt: new Date()
    };
    
    // In a real app, you'd save to database
    // For now, we'll store in memory (in production, use MongoDB)
    if (!global.ratings) global.ratings = [];
    global.ratings.push(rating);
    
    res.status(200).json({ 
      message: 'Rating submitted successfully', 
      rating 
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ errorMessage: 'An error occurred while submitting rating' });
  }
});

// Get logistics ratings and statistics
app.get('/api/logistics-ratings/:logisticsId', async (req, res) => {
  try {
    const { logisticsId } = req.params;
    
    // Get ratings for this logistics partner
    const ratings = global.ratings?.filter(r => r.logisticsId === logisticsId) || [];
    
    if (ratings.length === 0) {
      return res.status(200).json({
        ratings: [],
        stats: {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          categoryAverages: {
            deliverySpeed: 0,
            serviceQuality: 0,
            communication: 0,
            packaging: 0
          }
        }
      });
    }
    
    // Calculate statistics
    const totalRatings = ratings.length;
    const averageRating = ratings.reduce((sum, r) => sum + r.overallRating, 0) / totalRatings;
    
    // Rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(r => {
      ratingDistribution[r.overallRating]++;
    });
    
    // Category averages
    const categoryAverages = {
      deliverySpeed: ratings.reduce((sum, r) => sum + r.categoryRatings.deliverySpeed, 0) / totalRatings,
      serviceQuality: ratings.reduce((sum, r) => sum + r.categoryRatings.serviceQuality, 0) / totalRatings,
      communication: ratings.reduce((sum, r) => sum + r.categoryRatings.communication, 0) / totalRatings,
      packaging: ratings.reduce((sum, r) => sum + r.categoryRatings.packaging, 0) / totalRatings
    };
    
    res.status(200).json({
      ratings: ratings.sort((a, b) => new Date(b.ratingDate) - new Date(a.ratingDate)),
      stats: {
        averageRating,
        totalRatings,
        ratingDistribution,
        categoryAverages
      }
    });
  } catch (error) {
    console.error('Error fetching logistics ratings:', error);
    res.status(500).json({ errorMessage: 'An error occurred while fetching ratings' });
  }
});

// Get all logistics ratings (for admin dashboard)
app.get('/api/all-logistics-ratings', async (req, res) => {
  try {
    const ratings = global.ratings || [];
    
    // Group by logistics partner
    const logisticsStats = {};
    
    ratings.forEach(rating => {
      if (!logisticsStats[rating.logisticsId]) {
        logisticsStats[rating.logisticsId] = {
          logisticsId: rating.logisticsId,
          totalRatings: 0,
          averageRating: 0,
          ratings: []
        };
      }
      
      logisticsStats[rating.logisticsId].ratings.push(rating);
      logisticsStats[rating.logisticsId].totalRatings++;
    });
    
    // Calculate averages for each logistics partner
    Object.values(logisticsStats).forEach(stats => {
      stats.averageRating = stats.ratings.reduce((sum, r) => sum + r.overallRating, 0) / stats.totalRatings;
    });
    
    res.status(200).json({
      logisticsStats: Object.values(logisticsStats),
      totalRatings: ratings.length
    });
  } catch (error) {
    console.error('Error fetching all logistics ratings:', error);
    res.status(500).json({ errorMessage: 'An error occurred while fetching ratings' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
