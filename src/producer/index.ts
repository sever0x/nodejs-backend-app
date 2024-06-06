import { Kafka } from 'kafkajs';
import config from "../config";

const kafka = new Kafka({
    clientId: config.kafka.clientId,
    brokers: config.kafka.brokers
});

const producer = kafka.producer();

const sendMessage = async (message: any) => {
    await producer.connect();
    await producer.send({
        topic: config.kafka.topic,
        messages: [
            { value: JSON.stringify(message) }
        ]
    });
    await producer.disconnect();
};

export { sendMessage };
