import mongoose from 'mongoose';

/**
 * Connect to MongoDB through mongoose.
 * @param {String} url - connect to database.
 */
function connectMongoose(url) {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
      .then((result) => {
        console.log('Mongoose connected to ' + result.connection[0].host);
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
}

export default connectMongoose();
