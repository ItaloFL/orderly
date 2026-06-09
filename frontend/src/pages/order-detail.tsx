import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  ShoppingBag,
  Package,
  CreditCard,
  Loader2,
} from "lucide-react";
import { orderService } from "@/lib/order-service";

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
    icon: CheckCircle2,
  },
  PENDING: {
    label: "Aguardando Pagamento",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    icon: Clock,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    icon: XCircle,
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
  const navigate = useNavigate();

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
      const currentOrder = query.state.data as Order | undefined;
      return currentOrder?.status === "PENDING" ? 3000 : false;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d0b] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#090d0b] flex flex-col items-center justify-center gap-4">
        <Package size={48} className="text-white/10" />
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
  const StatusIcon = status.icon;

  return (
    <div className="relative min-h-screen bg-[#090d0b]">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: [
            order.status === "CANCELLED"
              ? "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 100%)"
              : "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 100%)",
            "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "100% 100%, 28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-4 py-12">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8 animate-in fade-in slide-in-from-left-4 duration-500"
        >
          <ArrowLeft size={15} />
          Meus pedidos
        </Link>

        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 backdrop-blur-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Package size={18} className="text-white/40" />
              </div>
              <div>
                <p className="text-[11px] text-white/30 uppercase tracking-widest">
                  Pedido
                </p>
                <p className="font-mono text-sm text-emerald-500/80">
                  #{order.id}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border ${status.bg} ${status.color}`}
            >
              <StatusIcon size={14} />
              {status.label}
            </span>
          </div>

          <div className="px-6 py-6 border-b border-white/[0.06]">
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-4">
              Status do Pedido
            </p>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-white/[0.06]">
                <div
                  className={`h-full transition-all duration-500 ${
                    order.status === "CONFIRMED"
                      ? "w-full bg-emerald-500/50"
                      : order.status === "CANCELLED"
                        ? "w-1/2 bg-red-500/50"
                        : "w-1/3 bg-amber-500/50"
                  }`}
                />
              </div>

              <div className="relative flex flex-col items-center gap-2 z-10">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 bg-[#0d130f] flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  Criado
                </span>
              </div>

              <div className="relative flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-10 h-10 rounded-full border-2 bg-[#0d130f] flex items-center justify-center transition-all ${
                    order.status === "PENDING"
                      ? "border-amber-500/50 animate-pulse"
                      : order.status === "CONFIRMED"
                        ? "border-emerald-500/50"
                        : "border-red-500/50"
                  }`}
                >
                  {order.status === "PENDING" ? (
                    <Clock size={18} className="text-amber-400" />
                  ) : order.status === "CONFIRMED" ? (
                    <CreditCard size={18} className="text-emerald-500" />
                  ) : (
                    <XCircle size={18} className="text-red-400" />
                  )}
                </div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  Pagamento
                </span>
              </div>

              <div className="relative flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-10 h-10 rounded-full border-2 bg-[#0d130f] flex items-center justify-center ${
                    order.status === "CONFIRMED"
                      ? "border-emerald-500/50"
                      : "border-white/[0.06]"
                  }`}
                >
                  {order.status === "CONFIRMED" ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <Package size={18} className="text-white/20" />
                  )}
                </div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  Confirmado
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-white/[0.06] grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1.5">
                Data do Pedido
              </p>
              <p className="text-sm text-white/70">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1.5">
                Método de Pagamento
              </p>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CreditCard size={14} className="text-white/30" />
                Stripe Sandbox
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-4">
              Itens do Pedido
            </p>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={item.id}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="animate-in fade-in slide-in-from-left-3 duration-400 fill-mode-backwards flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <ShoppingBag size={14} className="text-white/30" />
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

          <div className="px-6 py-5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-sm text-white/50 uppercase tracking-wider">
              Total
            </span>
            <span className="text-2xl font-bold text-emerald-400">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-3 animate-in fade-in duration-700 delay-300">
          <Link
            to="/products"
            className="flex-1 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center text-sm text-white/50 hover:bg-white/[0.05] hover:text-white/80 transition-all"
          >
            Continuar comprando
          </Link>
          <Link
            to="/orders"
            className="flex-1 py-3 rounded-xl bg-emerald-500 text-center text-sm font-bold text-[#090d0b] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            Meus pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
