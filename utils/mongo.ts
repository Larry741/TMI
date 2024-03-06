const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  // throw new Error(
  //   "Please define the MONGO_URL environment variable inside .env.local"
  // );
  console.log(
    "Please define the MONGO_URL environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

let globe = global as any;
let cached: any = globe.mongoose;

if (!cached) {
  cached = globe.mongoose = { conn: null, promise: null };
}

mongoose.connection.on("open", () => {
  console.log("db connected");
});

mongoose.connection.on("error", () => {
  console.log("error connecting to db");
});

async function dbConnect() {
  if (process.env.NODE_ENV === "development") {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false
      };

      cached.promise = mongoose
        .connect(MONGO_URL, opts)
        .then((mongoose: any) => {
          return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } else if (process.env.NODE_ENV === "production") {
    // if (mongoose.connection.readyState === 1) {
    // 	return mongoose
    // }
    return mongoose.connect(MONGO_URL).then((mongoose: any) => {
      return mongoose;
    });
  }
}

async function disconnectDb() {
  try {
    cached = globe.mongoose = { conn: null, promise: null };

    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}

export { dbConnect, disconnectDb };
