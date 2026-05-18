import { useState } from "react";
import { CreditCard, Loader2, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  total: number;
  onConfirm: (method: "approve" | "decline") => void;
  isProcessing: boolean;
}

export function PaymentModal({
  open,
  onClose,
  orderId,
  total,
  onConfirm,
  isProcessing,
}: PaymentModalProps) {
  const [result, setResult] = useState<"success" | "failed" | null>(null);

  function handlePayment(method: "approve" | "decline") {
    onConfirm(method);
    setResult(method === "approve" ? "success" : "failed");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] bg-[#0d130f] border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <CreditCard size={18} className="text-emerald-500" />
            Processamento de Pagamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/40">
                  Pedido
                </p>
                <p className="text-sm font-mono text-white/70">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider text-white/40">
                  Total
                </p>
                <p className="text-lg font-bold text-white">
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
          </div>

          {isProcessing ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 size={32} className="animate-spin text-emerald-500" />
              <p className="text-sm text-white/60">Processando pagamento...</p>
            </div>
          ) : result ? (
            <div className="flex flex-col items-center gap-3 py-6">
              {result === "success" ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 size={24} className="text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-white">
                    Pagamento aprovado!
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                    <XCircle size={24} className="text-red-400" />
                  </div>
                  <p className="text-sm font-medium text-white">
                    Pagamento recusado
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-xs text-white/40 uppercase tracking-wider">
                  Simular pagamento com:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handlePayment("approve")}
                    className="flex flex-col gap-1 h-auto py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                  >
                    <CheckCircle2 size={20} />
                    <span className="text-xs">Aprovar</span>
                    <span className="text-[10px] opacity-60">4242 ••••</span>
                  </Button>
                  <Button
                    onClick={() => handlePayment("decline")}
                    className="flex flex-col gap-1 h-auto py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400"
                  >
                    <XCircle size={20} />
                    <span className="text-xs">Recusar</span>
                    <span className="text-[10px] opacity-60">0002 ••••</span>
                  </Button>
                </div>
              </div>

              <p className="text-center text-xs text-white/25 pt-2">
                Processado via Stripe Sandbox
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
