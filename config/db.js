const mongoose = require("mongoose");

let connectionPromise;

const db_connect = async (mongodburi) => {
  if (!mongodburi) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongodburi)
      .then((connection) => {
        connectionPromise = null;
        console.log("✓ mongodb connected");
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = db_connect;