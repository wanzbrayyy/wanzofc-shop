
const config = {
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://zanssxploit:pISqUYgJJDfnLW9b@cluster0.fgram.mongodb.net/wanzofc_shop?retryWrites=true&w=majority',
  
  // Database name
  dbName: 'wanzofc_shop',
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
