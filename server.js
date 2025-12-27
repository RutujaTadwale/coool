const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Fix: Use environment variable OR fallback
const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);
let db;

// Connect on startup
async function connectDB() {
    try {
        await client.connect();
        db = client.db("heeha-db");
        console.log('Connected to MongoDB at', MONGO_URL);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
}
connectDB();

// Serve index.html on root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        if (!db) return res.status(503).send("Database not ready");
        const data = await db.collection('users').find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching users");
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    try {
        console.log('Creating user:', req.body);
        if (!db) return res.status(503).send("Database not ready");
        const userObj = req.body;
        const result = await db.collection('users').insertOne(userObj);
        console.log('User created:', result.insertedId);
        res.redirect("/");
    } catch (error) {
        console.error('User creation failed:', error);
        res.status(500).send("Error creating user");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
