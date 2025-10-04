const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const amqp = require("amqplib");
const app = express();
let port = 3002;

mongoose.connect("mongodb://mongo:27017/userdb")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));


const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: mongoose.Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now  
    }
});

const Task = mongoose.model("Task", TaskSchema);

let channel, connection;

async function connectRabbitMQWithRetry(retries = 5, delay = 3000) {
    while(retries){
        try{
            connection = await amqp.connect("amqp://rabbitmq");
            channel = await connection.createChannel();
            await channel.assertQueue("task_queue");
            console.log("Connected to RabbitMQ");
            break;
        }catch(error){
            console.log("RabbitMQ connection failed, retrying...", error);
            retries--;
            console.log(`Retries left: ${retries}`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
}


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/tasks", async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();

        let message = {taskId: task._id, userId: task.userId, title: task.title};

        if(!channel){
            return res.status(503).json({message: "Service unavailable, try again later"});
        }

        channel.sendToQueue("task_queue", Buffer.from(JSON.stringify(message)));
        res.status(201).json(task);
    } catch (error) {
        console.error("Error saving task:", error);
        res.status(400).send("Error saving task");
    }
});

app.get("/getTasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Error fetching tasks");
    }
});

app.get("/", (req, res) => {
    res.send([{ id: 1, title: "Task 1" }, { id: 2, title: "Task 2" }]);
});

app.listen(port, async() => {
    console.log(`Task service listening on port ${port}`);
    await connectRabbitMQWithRetry();
});