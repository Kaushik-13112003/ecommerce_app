import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    } else {
      const uri = process.env.MONGODB_URI;
      // await mongoose.connect(uri, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
      // });
      return mongoose.connect(uri);
    }
  } catch (err) {
    console.log(err);
  }
}
