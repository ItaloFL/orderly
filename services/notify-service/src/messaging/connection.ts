import amqplib, { ChannelModel, Channel } from "amqplib";

let connection: ChannelModel;
let channel: Channel;

export async function getRabbitChannel(): Promise<Channel> {
  if (channel) return channel;

  connection = await amqplib.connect(process.env.RABBITMQ_URL!);
  channel = await connection.createChannel();

  await channel.assertExchange("orderly.events", "topic", { durable: true });

  return channel;
}
