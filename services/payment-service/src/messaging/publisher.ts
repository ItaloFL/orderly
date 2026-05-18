import { getRabbitChannel } from "./connection";

export async function publishEvent(routingKey: string, data: unknown) {
  const channel = await getRabbitChannel();

  channel.publish(
    "orderly.events",
    routingKey,
    Buffer.from(
      JSON.stringify({
        event: routingKey,
        data,
        timestamp: new Date().toISOString(),
      }),
    ),
    { persistent: true },
  );

  console.log(`Evento publicado: ${routingKey}`);
}
