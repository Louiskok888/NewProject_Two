import mongoose from 'mongoose';

// MongoDB connection setup
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;  // already connected
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default async function handler(req, res) {
  // Ensure it's a POST request
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      await connectToDatabase();

      const newUser = new User({ name, email, password });
      await newUser.save();
      
      return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      return res.status(500).json({ error: 'Error registering user: ' + error.message });
    }
  } else {
    // Handle other HTTP methods (GET, PUT, DELETE)
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
