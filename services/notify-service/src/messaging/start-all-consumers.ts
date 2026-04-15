import { startPasswordResetConsumer } from "../consumers/password-reset-consumer";

export async function startAllConsumers() {
  await startPasswordResetConsumer();
}
