const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) 
      return; 
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'janis-products',
      serverSelectionTimeoutMS: 5000, // Tiempo de espera para la conexión inicial
      socketTimeoutMS: 45000 // Tiempo de espera para operaciones
    });
    
    console.log('Successfully connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw Error;
  }
};

module.exports = { connectToDatabase };
