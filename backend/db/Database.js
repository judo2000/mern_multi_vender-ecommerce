const mongoose = require('mongoose');

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    })
    .then((data) => {
      console.log(`mongodb is connected to server: ${data.connection.host}`);
    });
};

module.exports = connectDB;
