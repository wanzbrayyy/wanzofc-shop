
// Database connection and initialization script
// This file handles MongoDB connection using Mongoose

import mongoose from 'mongoose';
import config from '../config/database.js';

class Database {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  // Connect to MongoDB
  async connect() {
    try {
      if (this.isConnected) {
        console.log('Database already connected');
        return this.connection;
      }

      console.log('Connecting to MongoDB...');
      this.connection = await mongoose.connect(config.mongoUri, config.options);
      this.isConnected = true;

      console.log(`MongoDB connected: ${this.connection.connection.host}`);
      
      // Set up event listeners
      this.setupEventListeners();
      
      return this.connection;
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  // Disconnect from MongoDB
  async disconnect() {
    try {
      if (!this.isConnected) {
        console.log('Database not connected');
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;
      this.connection = null;
      console.log('MongoDB disconnected');
    } catch (error) {
      console.error('Database disconnection error:', error);
      throw error;
    }
  }

  // Setup event listeners
  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      console.error('Mongoose connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }

  // Initialize database with default data
  async initialize() {
    try {
      const { default: Admin } = await import('../models/Admin.js');
      
      // Check if admin config exists
      const existingAdmin = await Admin.findOne();
      
      if (!existingAdmin) {
        // Create default admin config
        const defaultAdmin = new Admin({
          telegramUsername: 'maverick_dark',
          botToken: 'YOUR_BOT_TOKEN_HERE',
          adminChatId: 'YOUR_ADMIN_CHAT_ID_HERE'
        });
        
        await defaultAdmin.save();
        console.log('Default admin configuration created');
      }
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      await mongoose.connection.db.admin().ping();
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
  }
}

// Create singleton instance
const database = new Database();

export default database;
