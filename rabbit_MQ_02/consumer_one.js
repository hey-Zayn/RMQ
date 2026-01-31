const amqp = require("amqplib");

const getData = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const queueOne = "queue_one"
        await channel.assertQueue(queueOne, { durable: false });

        channel.consume(queueOne, (msg) => {
            if (msg !== null) {
                console.log("Message received", JSON.parse(msg.content.toString()));
                channel.ack(msg);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

getData();

