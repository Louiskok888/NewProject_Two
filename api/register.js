// api/register.js
const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await client.connect();
        const database = client.db('userdb'); // Replace with your database name
        const usersCollection = database.collection('users'); // Replace with your collection name

        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Insert new user into the collection
        await usersCollection.insertOne({ name, email, password });

        return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    } finally {
        await client.close();
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
