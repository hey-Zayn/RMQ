# Advanced RabbitMQ: Multiple Queues & Routing

This module builds on the fundamentals and demonstrates how a single **Exchange** can route messages to multiple **Queues** based on different **Routing Keys**.

---

## 🏗️ Architecture Overview

In this setup, we have:

- **1 Producer**: Sends data to an exchange.
- **1 Exchange**: Acts as a router.
- **2 Queues**: `queue_one` and `queue_two`.
- **2 Consumers**: Each listening to its own dedicated queue.

### Why use multiple queues?

Imagine an e-commerce system:

- `queue_one` could handle **Email Notifications**.
- `queue_two` could handle **Inventory Updates**.
  The producer can decide where to send the data by just changing the **Routing Key**.

---

## 🧭 Advanced Routing Concepts

### 1. Separation of Concerns

By using different queues, we ensure that specialized consumers only process relevant data. If one consumer is slow or crashes, it doesn't affect the other.

### 2. Deep Dive: Routing Keys

- `data_one` → Routes to `queue_one`
- `data_two` → Routes to `queue_two`

> [!IMPORTANT]
> A single exchange can be bound to as many queues as you want. The routing key is the "GPS address" for the message.

---

## 🛠️ Code Walkthrough

### 1. Producer (`producer.js`)

The producer now handles multiple routing keys and binds multiple queues.

```javascript
const exchane = "exchane_data";
const routingKeyOne = "data_one";
const routingKeyTwo = "data_two";

// Asserting multiple queues
await channel.assertQueue("queue_one", { durable: false });
await channel.assertQueue("queue_two", { durable: false });

// Binding both queues to the SAME exchange but with DIFFERENT routing keys
await channel.bindQueue("queue_one", exchane, routingKeyOne);
await channel.bindQueue("queue_two", exchane, routingKeyTwo);

// Publishing to a specific routing key
channel.publish(exchane, routingKeyTwo, Buffer.from(JSON.stringify(data)));
```

### 2. Consumers (`consumer_one.js` & `consumer_two.js`)

Each consumer is simple and only cares about its specific queue.

**Consumer One:**

```javascript
const queueOne = "queue_one";
await channel.assertQueue(queueOne, { durable: false });
channel.consume(queueOne, (msg) => {
  console.log("Consumer 1 received:", JSON.parse(msg.content.toString()));
  channel.ack(msg);
});
```

**Consumer Two:**

```javascript
const queueTwo = "queue_two";
await channel.assertQueue(queueTwo, { durable: false });
channel.consume(queueTwo, (msg) => {
  console.log("Consumer 2 received:", JSON.parse(msg.content.toString()));
  channel.ack(msg);
});
```

---

## 🧪 How to Test

1. **Start RabbitMQ** (e.g., via Docker).
2. **Run Consumers**: Open two terminals and run `node consumer_one.js` and `node consumer_two.js`.
3. **Run Producer**: In a third terminal, run `node producer.js`.
4. **Observe**: Depending on the routing key in `producer.js`, only one of the consumers will receive the message.

---

## ✅ Key Takeaways

- Use **Direct Exchanges** for simple, targeted routing.
- **Queues** are buffers; **Exchanges** are routers.
- **Routing Keys** provide the logic for message delivery.
