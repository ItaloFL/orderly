import { getRabbitChannel } from "./connection";

export async function publishEvent(routingKey: string, data: unknown) {
  const channel = await getRabbitChannel();

  const message = JSON.stringify({
    event: routingKey,
    data,
    timestamp: new Date().toISOString(),
  });

  channel.publish("orderly.events", routingKey, Buffer.from(message), {
    persistent: true,
  });

  console.log(`Evento publicado: ${routingKey}`);
}
