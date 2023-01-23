import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Initialize in memory testing database.
 */
export async function initializeMongoServer(): Promise<void> {
  const mongoServer = await MongoMemoryServer.create({
    binary: { version: '4.4.4' },
  });
  const mongoUri = mongoServer.getUri();
  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  mongoose.connection.on('error', async (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      await mongoose.connect(mongoUri);
    }
    console.log(e);
  });

  /*
  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
  */
}

/**
 * Drop database
 */
export async function dropDatabase(): Promise<void> {
  await mongoose.connection.db.dropDatabase();
}

/**
 * Stop mongo server
 */
export async function stopMongoServer(): Promise<void> {
  await mongoose.disconnect();

  /*
  mongoose.connection.once('close', () => {
    console.log('MongoDB connection closed');
  });
  */
}
