const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import the ChatMessage model
const ChatMessage = require("./models/ChatMessage");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://chandramouli:Password123@cluster0.rrsf2.mongodb.net/ChatApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.get("/messages", async (req, res) => {
    try {
        const messages = await ChatMessage.find();
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/messages", async (req, res) => {
    try {
        const { user, message } = req.body;

        if (!user || !message) {
            return res
                .status(400)
                .json({ error: "User and message are required" });
        }

        const chatMessage = new ChatMessage({
            user,
            message,
        });

        await chatMessage.save();

        res.status(201).json(chatMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
