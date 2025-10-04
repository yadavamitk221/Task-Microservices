const amqp = require("amqplib");

let connection, channel;

async function start(retries = 5, delay = 3000) {
    while(retries){
        try{
            connection = await amqp.connect("amqp://rabbitmq");
            channel = await connection.createChannel();
            await channel.assertQueue("task_queue");
            console.log("Connected to RabbitMQ");

            channel.consume("task_queue", (msg) => {
                const messageContent = msg.content.toString();
                console.log("Received:", messageContent);
                channel.ack(msg);
            });
            break;
        }catch(error){
            console.log("RabbitMQ connection failed, retrying...", error);
            retries--;
            console.log(`Retries left: ${retries}`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
}

start();