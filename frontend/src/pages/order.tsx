import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Loader2,
  PackageCheck,
  ChevronDown,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orderService } from "../lib/order-service";
import { catalogService } from "@/lib/catalog-service";
import { useCart } from "@/contexts/cart-content";
import type { Product } from "./products";

export function CreateOrder() {
  const navigate = useNavigate();
  const { items, addItem, updateQuantity, removeItem, total, clearCart } =
    useCart();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await catalogService.list();
      return data as Product[];
    },
  });

  const createMutation = useMutation({
    mutationFn: orderService.create,
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        clearCart();
        navigate("/orders");
      }, 2200);
    },
  });

  function handleSubmit() {
    if (!items.length) return;
    createMutation.mutate({
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });
  }

  return (
    <div
      className="relative min-h-screen bg-[#090d0b] flex items-start justify-center py-14 px-4 overflow-y-auto"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 70%)",
      }}
    >
      <div className="relative w-full max-w-[520px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <ShoppingCart size={18} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-medium text-white">
                  Novo Pedido Rápido
                </h1>
                <p className="text-xs text-white/30">
                  Monte sua ordem e publique na fila
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {success ? (
              <div className="flex flex-col items-center py-10 text-center space-y-4 animate-in zoom-in-95">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <PackageCheck size={32} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Pedido Criado!
                  </h2>
                  <p className="text-sm text-white/40 mt-1">
                    Evento order.created enviado ao RabbitMQ
                  </p>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full animate-[progress_2s_ease-in-out]" />
                </div>
              </div>
            ) : (
              <>
                {createMutation.isError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    {(createMutation.error as any).message}
                  </div>
                )}

                {/* Seletor de Produtos — API real */}
                <div className="relative">
                  <button
                    onClick={() => setCatalogOpen(!catalogOpen)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white/60 hover:bg-white/10 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Plus size={16} className="text-emerald-500" />
                      Adicionar do Catálogo
                    </span>
                    <ChevronDown
                      size={16}
                      className={catalogOpen ? "rotate-180" : ""}
                    />
                  </button>

                  {catalogOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 z-50 rounded-xl border border-white/10 bg-[#161b18] shadow-2xl max-h-60 overflow-y-auto p-2">
                      {loadingProducts ? (
                        <div className="flex justify-center py-6">
                          <Loader2
                            size={18}
                            className="animate-spin text-emerald-500"
                          />
                        </div>
                      ) : (
                        products.map((p) => {
                          const inCart = items.some(
                            (i) => i.productId === p.id,
                          );
                          return (
                            <button
                              key={p.id}
                              disabled={p.stock === 0 || inCart}
                              onClick={() => {
                                addItem({
                                  productId: p.id,
                                  name: p.name,
                                  price: p.price,
                                  imageUrl: p.imageUrl,
                                  quantity: 1,
                                });
                                setCatalogOpen(false);
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <div>
                                <p className="text-sm text-white">{p.name}</p>
                                <p className="text-xs text-white/30">
                                  {p.category}
                                  {p.stock === 0 && " · Sem estoque"}
                                  {inCart && " · No carrinho"}
                                </p>
                              </div>
                              <span className="text-emerald-400 font-medium text-sm">
                                {p.price.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* Itens */}
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="py-10 border-2 border-dashed border-white/5 rounded-2xl text-center">
                      <p className="text-sm text-white/20">Carrinho vazio</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-white/30">
                            {item.price.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1 text-white/40 hover:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1 text-white/40 hover:text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-white/20 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="pt-4 space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-white/30 uppercase tracking-widest">
                        Total Geral
                      </span>
                      <span className="text-2xl font-bold text-white">
                        {total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={createMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                      {createMutation.isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          Confirmar e Publicar <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  );
}
