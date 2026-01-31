const amqp = require("amqplib");

// step -1 crete function
async function sendMail() {
    try {
        // step -2 create connection and channel
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        // step -3 exhange and routing key
        const exchange = "mail_exchange"
        const routingKey = "mail_send"
        // data / payload
        const message = {
            to: "zainbutt03003636186@gmail.com",
            subject: "This is temp mail",
            text: "This is a test mail",
        }

        // step -4 create exchange and queues
        await channel.assertExchange(exchange, 'direct', { durable: false });
        await channel.assertQueue('mail_queue', { durable: false });
        await channel.bindQueue('mail_queue', exchange, routingKey);
        // step -5 publish message
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        console.log("Message sent successfully", message);
        // step -6 close connection
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.log(error);
    }
}
sendMail();
