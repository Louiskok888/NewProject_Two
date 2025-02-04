// /pages/api/register.js
import mongoose from 'mongoose';

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default async (req, res) => {
  // Allow requests from your frontend domain
  res.setHeader('Access-Control-Allow-Origin', 'https://project-f8mrenutj-louiskok888s-projects.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      await connectToDatabase();
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
