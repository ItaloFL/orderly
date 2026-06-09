import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Receipt,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { PageWrapper } from "../components/page-wrapper";
import { orderService } from "@/lib/order-service";
import { catalogService } from "@/lib/catalog-service";

type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isActive: boolean;
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initials = (email: string) => email.slice(0, 2).toUpperCase();

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  CONFIRMED: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 p-5 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
          {label}
        </span>
        <Icon size={16} className="text-emerald-500/60" />
      </div>
      <p className="text-2xl font-extrabold text-white tracking-tight">
        {value}
      </p>
      <p className="text-[11px] text-white/30">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function StockDot({ stock }: { stock: number }) {
  const color =
    stock === 0
      ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]"
      : stock <= 2
        ? "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
        : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]";
  return <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />;
}

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["data", "orders", "products", "items", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

function useDashboard() {
  const ordersQuery = useQuery<Order[]>({
    queryKey: ["dashboard-orders"],
    queryFn: async () => {
      const response = await orderService.list();
      return toArray<Order>(response.data);
    },
  });

  const productsQuery = useQuery<Product[]>({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      const response = await catalogService.list();
      return toArray<Product>(response.data);
    },
  });

  const orders: Order[] = ordersQuery.data ?? [];
  const products: Product[] = productsQuery.data ?? [];

  const paidOrders = orders.filter((o) =>
    ["PAID", "CONFIRMED"].includes(o.status),
  );
  const totalRevenue = paidOrders.reduce((a, o) => a + o.total, 0);
  const avgTicket = paidOrders.length ? totalRevenue / paidOrders.length : 0;
  const today = new Date().toDateString();
  const todayCount = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  ).length;
  const activeProducts = products.filter((p) => p.isActive).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

  const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "CANCELLED"];
  const statusBreakdown = statuses.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
    pct: orders.length
      ? Math.round(
          (orders.filter((o) => o.status === s).length / orders.length) * 100,
        )
      : 0,
  }));

  const catMap: Record<string, number> = {};
  products.forEach((p) => {
    catMap[p.category] = (catMap[p.category] ?? 0) + 1;
  });
  const categories = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const totalProducts = products.length || 1;

  const criticalStock = [...products]
    .filter((p) => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);

  return {
    isLoading: ordersQuery.isLoading || productsQuery.isLoading,
    kpis: {
      totalRevenue,
      avgTicket,
      todayCount,
      activeProducts,
      totalProducts: products.length,
    },
    recentOrders,
    statusBreakdown,
    categories,
    totalProducts,
    criticalStock,
  };
}

export function Dashboard() {
  const {
    isLoading,
    kpis,
    recentOrders,
    statusBreakdown,
    categories,
    totalProducts,
    criticalStock,
  } = useDashboard();

  const STATUS_BAR_COLORS: Record<OrderStatus, string> = {
    PENDING: "bg-amber-500",
    CONFIRMED: "bg-sky-500",
    CANCELLED: "bg-red-500",
  };

  if (isLoading) {
    return (
      <PageWrapper title="Dashboard" subtitle="Visão geral da operação">
        <div className="flex flex-col items-center justify-center py-20 text-emerald-500">
          <Loader2 className="size-10 animate-spin mb-4" />
          <p className="text-white/60 text-sm">Carregando dados...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Dashboard"
      subtitle="Visão geral da operação em tempo real."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Receita total"
          value={fmt(kpis.totalRevenue)}
          sub="Pedidos pagos e confirmados"
          icon={TrendingUp}
        />
        <KpiCard
          label="Pedidos hoje"
          value={String(kpis.todayCount)}
          sub="Novos pedidos nas últimas 24h"
          icon={ShoppingCart}
        />
        <KpiCard
          label="Ticket médio"
          value={fmt(kpis.avgTicket)}
          sub="Por pedido pago"
          icon={Receipt}
        />
        <KpiCard
          label="Produtos ativos"
          value={String(kpis.activeProducts)}
          sub={`De ${kpis.totalProducts} cadastrados`}
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 p-5 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)]">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">
            Status dos pedidos
          </p>
          <div className="space-y-3">
            {statusBreakdown.map(({ status, count, pct }) => (
              <div key={status} className="flex items-center gap-3">
                <span className="text-[11px] text-white/50 w-36 truncate">
                  {STATUS_LABEL[status]}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${STATUS_BAR_COLORS[status]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-white/30 w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 p-5 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)]">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">
            Produtos por categoria
          </p>
          <div className="space-y-3">
            {categories.map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-[11px] text-white/50 w-44 truncate">
                  {cat}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{
                      width: `${Math.round((count / totalProducts) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-white/30 w-6 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 p-5 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)]">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">
            Pedidos recentes
          </p>
          <div className="divide-y divide-white/[0.04]">
            {recentOrders.length === 0 && (
              <p className="text-center text-white/30 py-8 text-sm">
                Nenhum pedido encontrado.
              </p>
            )}
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-3 py-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 flex-shrink-0">
                  {initials(order.userEmail)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    {order.userEmail}
                  </p>
                  <p className="text-[11px] text-white/30">
                    {new Date(order.createdAt).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <span className="text-sm font-bold text-white tabular-nums">
                  {fmt(order.total)}
                </span>

                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 p-5 backdrop-blur-xl shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)]">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={13} className="text-amber-500" />
            Estoque crítico
          </p>

          {criticalStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Package size={28} className="text-emerald-500/40" />
              <p className="text-xs text-white/30 text-center">
                Todos os produtos com estoque suficiente.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {criticalStock.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 py-3">
                  <StockDot stock={p.stock} />
                  <span className="flex-1 text-sm text-white/70 truncate">
                    {p.name}
                  </span>
                  <span
                    className={`text-[11px] font-bold tabular-nums ${
                      p.stock === 0
                        ? "text-red-400"
                        : p.stock <= 2
                          ? "text-red-400"
                          : "text-amber-400"
                    }`}
                  >
                    {p.stock === 0 ? "Esgotado" : `${p.stock} un`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
