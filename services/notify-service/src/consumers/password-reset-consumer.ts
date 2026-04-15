import { getRabbitChannel } from "../messaging/connection";
import { sendResetPasswordEmail } from "../services/send-reset-password-email-service";

export async function startPasswordResetConsumer() {
  const channel = await getRabbitChannel();

  await channel.assertQueue("notify.password-reset", { durable: true });

  await channel.bindQueue(
    "notify.password-reset",
    "orderly.events",
    "auth.password-reset-requested",
  );

  channel.prefetch(1);

  channel.consume("notify.password-reset", async (msg) => {
    if (!msg) return;

    let data: { name: string; email: string; token: string };

    try {
      data = JSON.parse(msg.content.toString());
    } catch {
      channel.nack(msg, false, false);
      return;
    }

    try {
      await sendResetPasswordEmail(data.name, data.email, data.token);

      channel.ack(msg);
    } catch (error) {
      channel.nack(msg, false, true);
    }
  });
}
