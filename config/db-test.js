import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

/**
 * Initialize in memory testing database.
 */
export async function initializeMongoServer() {
  const mongoServer = await MongoMemoryServer.create({
    binary: {version: '4.4.4'},
  });
  const mongoUri = mongoServer.getUri();
  mongoose.set('strictQuery', true);

  mongoose.connect(mongoUri);

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
 * Drop database
 */
export async function dropDatabase() {
  await mongoose.connection.db.dropDatabase();
};

/**
 * Stop mongo server
 */
export async function stopMongoServer() {
  await mongoose.disconnect();

  mongoose.connection.once('close', () => {
    console.log('MongoDB connection closed');
  });
};
