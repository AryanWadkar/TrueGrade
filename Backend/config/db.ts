import * as mongoose from 'mongoose';
require('dotenv').config();

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      retryWrites: true,
    } as mongoose.ConnectOptions);
    console.log("Connected to DB !!");
  } catch (e) {
    console.log("Error connecting!");
  }
};

module.exports = InitiateMongoServer;

//mongodb+srv://wadkararyan01:<password>@cluster0.foo8llj.mongodb.net/?retryWrites=true&w=majority