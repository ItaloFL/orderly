import { useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { PageWrapper } from "../components/page-wrapper";
import { useCart } from "@/contexts/cart-content";
import { orderService } from "@/lib/order-service";

export function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const { data: order } = await orderService.create({
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const { data } = await orderService.createCheckout(order.id, {
        userId: order.userId,
        total,
      });

      console.log(data.checkoutUrl);

      return data.checkoutUrl;
    },
    onSuccess: (checkoutUrl) => {
      clearCart();
      window.location.href = checkoutUrl;
    },
  });

  if (items.length === 0) {
    return (
      <PageWrapper title="Seu Carrinho" subtitle="Seu carrinho está vazio.">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <ShoppingCart size={28} className="text-white/20" />
          </div>
          <p className="text-white/40 mb-4">Nenhum item no carrinho</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 text-[#090d0b] font-medium hover:bg-emerald-400 transition-all"
          >
            Ver Produtos
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Seu Carrinho"
      subtitle={`Você tem ${items.length} ${items.length === 1 ? "item" : "itens"} no carrinho.`}
    >
      {checkoutMutation.isError && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2.5">
          <p className="text-sm text-red-400">
            {checkoutMutation.error instanceof Error
              ? checkoutMutation.error.message
              : "Erro ao iniciar pagamento"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div
              key={item.productId}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-backwards flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <img
                src={item.imageUrl}
                className="w-20 h-20 rounded-xl object-cover border border-white/10"
                alt={item.name}
              />
              <div className="flex-1">
                <h4 className="font-medium text-white">{item.name}</h4>
                <p className="text-sm text-white/40">
                  {item.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/5">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="p-1 hover:text-emerald-500 transition-colors text-white/60"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-bold w-6 text-center text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="p-1 hover:text-emerald-500 transition-colors text-white/60"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-white">
                    {(item.price * item.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 backdrop-blur-xl sticky top-6">
            <h3 className="text-lg font-bold mb-6 text-white">Resumo</h3>
            <div className="space-y-3 pb-6 border-b border-white/5">
              <div className="flex justify-between text-white/50 text-sm">
                <span>Subtotal</span>
                <span>
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-white/50 text-sm">
                <span>Entrega</span>
                <span className="text-emerald-500">Grátis</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-6">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-emerald-500">
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <button
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-[#090d0b] transition-all hover:bg-emerald-400 disabled:opacity-50"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  Finalizar Compra
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-white/20">
              Pagamento seguro via Stripe
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
