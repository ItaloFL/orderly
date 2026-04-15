import { Resend } from "resend";
import { forgotPasswordTemplate } from "../templates/forgot-password-template";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendResetPasswordEmail(
  name: string,
  email: string,
  token: string,
) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = forgotPasswordTemplate(name, resetUrl);

  await resend.emails.send({
    from: "Orderly <no-reply@italofldev.com>",
    to: email,
    subject: "Redefinição de senha",
    html,
  });

  console.log(`Email de reset enviado para ${email}`);
}
