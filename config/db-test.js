import mongoose, {connect} from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

/**
 * Initialize in memory testing database.
 */
export async function initializeMongoServer() {
  const mongoServer = await MongoMemoryServer.create({
    binary: {version: '4.4.4'},
  });
  const mongoUri = mongoServer.getUri();

  connect(mongoUri);

  mongoose.set('strictQuery', true);
  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      connect(mongoUri);
    }
    console.log(e);
  });

  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
}

/**
 * Stop mongo server
 */
export async function stopMongoServer() {
  await mongoose.disconnect();

  mongoose.connection.once('close', () => {
    console.log('MongoDB connection closed');
  });
};
