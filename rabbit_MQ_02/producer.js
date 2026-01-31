const amqp = require("amqplib");

const send_data = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchane = "exchane_data";

        const routingKeyOne = "data_one"
        const routingKeyTwo = "data_two"

        const queueOne = "queue_one"
        const queueTwo = "queue_two"


        const data = {
            name: "Dev",
            age: 22,
            city: "Lahore"
        }

        await channel.assertExchange(exchane, "direct", { durable: false });

        await channel.assertQueue(queueOne, { durable: false })
        await channel.assertQueue(queueTwo, { durable: false })

        await channel.bindQueue(queueOne, exchane, routingKeyOne)
        await channel.bindQueue(queueTwo, exchane, routingKeyTwo)

        // --------- if you want to send message to queue one

        // channel.publish(exchane, routingKeyOne, Buffer.from(JSON.stringify(data)))

        // --------- if you want to send message to queue two
        channel.publish(exchane, routingKeyTwo, Buffer.from(JSON.stringify(data)))

        console.log("Message sent to RabbitMQ", data);

        setTimeout(() => {
            connection.close();
        }, 500);


    } catch (error) {
        console.log(error);
    }
}





send_data();