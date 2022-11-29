const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./db/Database');

// config
dotenv.config({
  path: 'backend/config/.env',
});

// connect database
connectDB();

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost${process.env.PORT}`);
});
