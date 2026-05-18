import { useState } from "react";
import {
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { PageWrapper } from "../components/page-wrapper";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/order-service";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Order {
  id: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  total: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface OrdersResult {
  data: Order[];
  meta: OrdersMeta;
}

const STATUS_MAP = {
  CONFIRMED: {
    label: "Confirmado",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    icon: <CheckCircle2 size={13} />,
  },
  PENDING: {
    label: "Pendente",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    icon: <Clock size={13} />,
  },
  CANCELLED: {
    label: "Cancelado",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    icon: <XCircle size={13} />,
  },
} as const;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function Orders() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<OrdersResult>({
    queryKey: ["orders", page],
    queryFn: async () => {
      const { data } = await orderService.list({ page });
      return data;
    },
    placeholderData: (prev) => prev,
  });

  const orders = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 0;
  const total = data?.meta.total ?? 0;

  const pageNumbers = (() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "ellipsis")[] = [1];
    if (page > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  })();

  return (
    <PageWrapper
      title="Meus Pedidos"
      subtitle="Acompanhe o histórico de suas compras."
    >
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 backdrop-blur-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.7)] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/[0.06]">
              {["ID Pedido", "Data", "Total", "Status", ""].map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-[11px] font-medium uppercase tracking-widest text-white/40"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-6 py-5">
                      <div className="h-4 rounded bg-white/[0.06]" />
                    </td>
                  ))}
                </tr>
              ))}

            {isError && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-red-400/70 text-sm"
                >
                  Erro ao carregar pedidos. Tente novamente mais tarde.
                </td>
              </tr>
            )}

            {!isLoading && !isError && orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/30">
                    <ShoppingBag size={32} className="opacity-40" />
                    <span className="text-sm">Nenhum pedido encontrado.</span>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              orders.map((order, index) => {
                const status = STATUS_MAP[order.status] ?? {
                  label: order.status,
                  color: "text-white/40",
                  bg: "bg-white/5 border-white/10",
                  icon: null,
                };
                return (
                  <tr
                    key={order.id}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-backwards hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5 font-mono text-sm text-emerald-500/80">
                      {order.id}
                    </td>
                    <td className="px-6 py-5 text-sm text-white/60">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${status.bg} ${status.color}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right text-white/20 group-hover:text-emerald-500 transition-colors">
                      <ChevronRight
                        size={18}
                        className="ml-auto group-hover:translate-x-1 transition-transform"
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-white/40">
          <span>
            {total} pedidos — página {page} de {totalPages}
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-30"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {pageNumbers.map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`e-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-30"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </PageWrapper>
  );
}
