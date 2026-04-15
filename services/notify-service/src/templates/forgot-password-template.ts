import mjml2html from "mjml";

export function forgotPasswordTemplate(name: string, resetUrl: string): string {
  const { html } = mjml2html(`
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-all font-family="Inter, sans-serif" />
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#090d0b">

        <mj-section padding="40px 0">
          <mj-column>
            <mj-text align="center" color="#10b981" font-size="22px" font-weight="600">
              Orderly
            </mj-text>
          </mj-column>
        </mj-section>

        <mj-section background-color="#0d130f" border-radius="16px" padding="40px">
          <mj-column>
            <mj-text color="#ffffff" font-size="18px" font-weight="500">
              Olá, ${name}
            </mj-text>
            <mj-text color="rgba(255,255,255,0.5)" font-size="14px" line-height="24px">
              Recebemos uma solicitação para redefinir a senha da sua conta.
              Clique no botão abaixo para continuar. O link expira em 1 hora.
            </mj-text>
            <mj-button
              background-color="#10b981"
              color="#090d0b"
              font-weight="600"
              border-radius="8px"
              href="${resetUrl}"
              inner-padding="12px 32px"
            >
              Redefinir senha
            </mj-button>
            <mj-text color="rgba(255,255,255,0.3)" font-size="12px">
              Se você não solicitou a redefinição, ignore este email.
            </mj-text>
          </mj-column>
        </mj-section>

        <mj-section>
          <mj-column>
            <mj-text align="center" color="rgba(255,255,255,0.15)" font-size="11px">
              © ${new Date().getFullYear()} Orderly. Todos os direitos reservados.
            </mj-text>
          </mj-column>
        </mj-section>

      </mj-body>
    </mjml>
  `);

  return html;
}
