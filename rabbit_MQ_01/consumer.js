const amqp = require("amqplib");


// step -1 connect to rabbitmq
async function recvMail() {
    try {
        // step -2 create connection
        const connection = await amqp.connect('amqp://localhost');
        // step -3 create channel
        const channel = await connection.createChannel();
        // step -4 create queue
        await channel.assertQueue("mail_queue", { durable: false });
        // step -5 consume message
        channel.consume("mail_queue", (message) => {
            if (message !== null) {
                console.log("Message received", JSON.parse(message.content));
                channel.ack(message);
            } else {
                console.log("No message received");
            }
        })

    } catch (error) {
        console.log(error);
    }
}
recvMail();