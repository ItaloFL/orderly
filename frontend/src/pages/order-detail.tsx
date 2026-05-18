import { useEffect } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Package,
  CreditCard,
  Loader2,
} from "lucide-react";
import { orderService } from "@/lib/order-service";
import { PageWrapper } from "@/components/page-wrapper";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_MAP = {
  CONFIRMED: {
    label: "Confirmado",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    icon: <CheckCircle2 size={14} />,
  },
  PENDING: {
    label: "Pendente",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    icon: <Clock size={14} />,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    icon: <XCircle size={14} />,
  },
} as const;

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const payment = searchParams.get("payment"); // "success" | "cancelled" | null

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data } = await orderService.getOne(id!);
      return data as Order;
    },
    enabled: !!id,
    refetchInterval: (query) => {
      // Acessa os dados via query.state.data
      const currentOrder = query.state.data as Order | undefined;
      return payment === "success" && currentOrder?.status === "PENDING"
        ? 2000
        : false;
    },
  });

  console.log(order)

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d0b] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  // Error
  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#090d0b] flex flex-col items-center justify-center gap-4">
        <p className="text-white/40">Pedido não encontrado.</p>
        <button
          onClick={() => navigate("/orders")}
          className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Ver todos os pedidos
        </button>
      </div>
    );
  }

  const status = STATUS_MAP[order.status];
  const isCancelled = payment === "cancelled" || order.status === "CANCELLED";
  const isSuccess = payment === "success" || order.status === "CONFIRMED";

  return (
    <div className="relative min-h-screen bg-[#090d0b]">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: [
            isCancelled
              ? "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 100%)"
              : "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 100%)",
            "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "100% 100%, 28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-4 py-12">
        {/* Back */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Meus pedidos
        </Link>

        {/* Banner de status do pagamento */}
        {(isSuccess || isCancelled) && (
          <div
            className={`animate-in fade-in slide-in-from-top-4 duration-500 mb-6 rounded-2xl border p-6 flex flex-col items-center text-center gap-3 ${
              isCancelled
                ? "border-red-500/20 bg-red-500/[0.06]"
                : "border-emerald-500/20 bg-emerald-500/[0.06]"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isCancelled ? "bg-red-500/10" : "bg-emerald-500/10"
              }`}
            >
              {isCancelled ? (
                <XCircle size={28} className="text-red-400" />
              ) : (
                <CheckCircle2 size={28} className="text-emerald-400" />
              )}
            </div>
            <div>
              <h2
                className={`text-lg font-bold ${isCancelled ? "text-red-400" : "text-emerald-400"}`}
              >
                {isCancelled ? "Pagamento cancelado" : "Pagamento confirmado!"}
              </h2>
              <p className="text-sm text-white/40 mt-1">
                {isCancelled
                  ? "Seu pagamento foi cancelado. Nenhuma cobrança foi realizada."
                  : "Seu pedido foi confirmado e está sendo processado."}
              </p>
            </div>
            {isCancelled && (
              <Link
                to="/cart"
                className="mt-1 px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-all"
              >
                Voltar ao carrinho
              </Link>
            )}
          </div>
        )}

        {/* Card principal */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 backdrop-blur-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Package size={16} className="text-white/40" />
              </div>
              <div>
                <p className="text-[11px] text-white/30 uppercase tracking-widest">
                  Pedido
                </p>
                <p className="font-mono text-sm text-emerald-500/80">
                  {order.id}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${status.bg} ${status.color}`}
            >
              {status.icon}
              {status.label}
            </span>
          </div>

          {/* Info */}
          <div className="px-6 py-4 border-b border-white/[0.06] grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1">
                Data
              </p>
              <p className="text-sm text-white/70">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1">
                Pagamento
              </p>
              <div className="flex items-center gap-1.5 text-sm text-white/70">
                <CreditCard size={13} className="text-white/30" />
                Stripe Checkout
              </div>
            </div>
          </div>

          {/* Itens */}
          <div className="px-6 py-4">
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-4">
              Itens do pedido
            </p>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={item.id}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="animate-in fade-in slide-in-from-left-2 duration-400 fill-mode-backwards flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <ShoppingBag size={13} className="text-white/30" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80 font-medium">
                        {item.productName}
                      </p>
                      <p className="text-xs text-white/30">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-white/30">
                      {formatCurrency(item.price)} / un
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="px-6 py-5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-sm text-white/50">Total</span>
            <span className="text-xl font-bold text-emerald-400">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-4 flex gap-3">
          <Link
            to="/products"
            className="flex-1 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center text-sm text-white/50 hover:bg-white/[0.05] hover:text-white/80 transition-all"
          >
            Continuar comprando
          </Link>
          <Link
            to="/orders"
            className="flex-1 py-3 rounded-xl bg-emerald-500 text-center text-sm font-bold text-[#090d0b] hover:bg-emerald-400 transition-all"
          >
            Meus pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
