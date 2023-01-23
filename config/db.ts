import mongoose from 'mongoose';

/**
 * Connect to MongoDB through mongoose.
 */
export default async function connectMongoose(url: string): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(url);
    mongoose.connection.on('connection', () => {
      console.log('Success MONGO');
    });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Mongo error: ${err}`);
    process.exit(1);
  }
}
