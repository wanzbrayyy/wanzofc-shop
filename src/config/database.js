
// Database configuration for MongoDB connection
// This file contains the MongoDB connection settings

const config = {
  // MongoDB connection string
  // Replace with your actual MongoDB connection string
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/wanzofc_shop',
  
  // Database name
  dbName: 'wanzofc_shop',
  
  // Connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  }
};

export default config;
