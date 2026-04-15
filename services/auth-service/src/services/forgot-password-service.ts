import { randomBytes } from "node:crypto";
import { prisma } from "../database/prisma";
import { getRabbitChannel } from "../messaging/connection";

interface ForgotPasswordServiceRequest {
  email: string;
}

export class ForgotPasswordService {
  async execute({ email }: ForgotPasswordServiceRequest) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) return;

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    const channel = await getRabbitChannel();
    channel.publish(
      "orderly.events",
      "auth.password-reset-requested",
      Buffer.from(
        JSON.stringify({
          name: user.name,
          email: user.email,
          token,
        }),
      ),
    );
  }
}
