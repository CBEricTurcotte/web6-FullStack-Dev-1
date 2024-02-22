
// mongo-manager.js

require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const Contact = require('./schemas/contact.Schema'); // Import the Contact model

const openMongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: false, // useNewUrlParser is deprecated
      useUnifiedTopology: false, // useUnifiedTopology is deprecated
      serverSelectionTimeoutMS: 5000, // How long the MongoDB driver waits for a connection to be established
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Handle the error appropriately (e.g., throw an error, exit the application)
  }
};

// Export the Contact model and connection function
module.exports = { openMongoConnection, Contact };