import mongoose from 'mongoose';

/**
 * Connect to MongoDB through mongoose.
 * @param {String} url - database URL.
 */
export default async function connectMongoose(url) {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log('Mongo error: ' + err);
    process.exit(1);
  }
}
