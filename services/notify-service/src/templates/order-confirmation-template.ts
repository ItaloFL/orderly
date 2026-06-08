import mjml2html from "mjml";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export function orderConfirmationTemplate(
  orderId: string,
  items: OrderItem[],
  total: number,
  createdAt: string,
): string {
  const formattedTotal = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const itemsHtml = items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
      <td style="padding: 12px; color: rgba(255,255,255,0.8); font-size: 14px;">
        ${item.productName}
      </td>
      <td style="padding: 12px; text-align: center; color: rgba(255,255,255,0.6); font-size: 14px;">
        ${item.quantity} un.
      </td>
      <td style="padding: 12px; text-align: right; color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 500;">
        ${item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </td>
    </tr>
  `,
    )
    .join("");

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
            <mj-text align="center" color="#10b981" font-size="20px" font-weight="600" padding="0 0 20px 0">
              ✅ Compra Confirmada!
            </mj-text>

            <mj-text color="rgba(255,255,255,0.6)" font-size="14px" line-height="24px">
              Sua compra foi confirmada e já está sendo preparada! Aqui estão os detalhes:
            </mj-text>

            <mj-section background-color="rgba(16,185,129,0.1)" border-left="4px solid #10b981" padding="20px">
              <mj-column>
                <mj-text color="#10b981" font-size="14px" font-weight="600">
                  Pedido #${orderId}
                </mj-text>
                <mj-text color="rgba(255,255,255,0.5)" font-size="12px">
                  ${new Date(createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </mj-text>
              </mj-column>
            </mj-section>

            <mj-text color="rgba(255,255,255,0.7)" font-size="13px" font-weight="600" padding="20px 0 10px 0">
              Produtos
            </mj-text>

            <mj-table>
              <tr style="border-bottom: 2px solid rgba(16,185,129,0.2); color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600;">
                <td style="padding: 12px; text-align: left;">Produto</td>
                <td style="padding: 12px; text-align: center;">Qtd</td>
                <td style="padding: 12px; text-align: right;">Valor</td>
              </tr>
              ${itemsHtml}
            </mj-table>

            <mj-section background-color="rgba(16,185,129,0.05)" padding="20px">
              <mj-column>
                <mj-text color="#10b981" font-size="16px" font-weight="600">
                  Total: ${formattedTotal}
                </mj-text>
              </mj-column>
            </mj-section>

            <mj-text color="rgba(255,255,255,0.6)" font-size="13px" line-height="20px" padding="20px 0 0 0">
              ✓ Pagamento confirmado<br/>
              ✓ Itens em preparação<br/>
              ✓ Você receberá atualizações por email
            </mj-text>

            <mj-button
              background-color="#10b981"
              color="#090d0b"
              font-weight="600"
              border-radius="8px"
              href="${process.env.FRONTEND_URL}/orders/${orderId}"
              inner-padding="12px 32px"
              margin-top="20px"
            >
              Ver Pedido
            </mj-button>
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
