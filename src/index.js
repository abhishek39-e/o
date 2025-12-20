//src
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Stop trying after 5 seconds
    });
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
  
};

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
});

// Model (overwrite error avoid)
const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === "GET") {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).json({ message: "Only GET allowed" });
};

