const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
let port = 3001;

mongoose.connect("mongodb://mongo:27017/userdb")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));


const UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model("User", UserSchema);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/users", async (req, res) => {
    const user = new User(req.body);  
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(400).send("Error saving user");
    }
});

app.get("/getUsers", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
});

app.get("/", (req, res) => {
    res.send([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]);
});

app.listen(port, () => {
    console.log(`User service listening on port ${port}`);
});