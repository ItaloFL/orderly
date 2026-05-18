import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, ArrowLeft, Mail } from "lucide-react";
import logo from "../../assets/logo.svg";
import { authService } from "../lib/auth-service";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const forgotPasswordSchema = z.object({
  email: z.email("E-mail invalido").trim(),
});

type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => setSent(true),
  });

  function onSubmit(data: ForgotPasswordType) {
    setEmailSent(data.email);
    mutate(data);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090d0b] flex items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(16,185,129,0.09) 0%, transparent 100%)",
            "radial-gradient(circle, rgba(255,255,255,0.032) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "100% 100%, 28px 28px",
        }}
      />

      <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out relative w-full max-w-[390px] mx-4">
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="rounded-2xl border border-white/[0.06] bg-[#0d130f]/90 backdrop-blur-xl px-8 py-9 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.7)]">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100 mb-8 flex justify-center">
            <img src={logo} alt="Orderly" className="h-12 w-auto" />
          </div>

          {!sent ? (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150 mb-7">
                <h1 className="text-[17px] font-medium tracking-tight text-white">
                  Esqueceu sua senha?
                </h1>
                <p className="mt-1 text-sm text-white/38">
                  Informe seu email e enviaremos um link para redefinição.
                </p>
              </div>

              {error && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-4 rounded-lg border border-red-500/20 bg-red-500/08 px-3.5 py-2.5">
                  <p className="text-sm text-red-400">{error.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200 space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-medium uppercase tracking-widest text-white/40"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="seu@email.com"
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 transition-all duration-200 focus:border-emerald-500/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-400/80">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-[250ms] pt-1">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-[#090d0b] transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <>
                        Enviar link
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                  <Mail size={24} className="text-emerald-400" />
                </div>
              </div>

              <div className="mb-6 text-center">
                <h2 className="text-[17px] font-medium tracking-tight text-white">
                  Email enviado
                </h2>
                <p className="mt-2 text-sm text-white/38">
                  Enviamos um link de redefinição para{" "}
                  <span className="text-white/60">{emailSent}</span>. Verifique
                  sua caixa de entrada.
                </p>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <p className="text-center text-[12px] text-white/30">
                  Não recebeu?{" "}
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-emerald-500/70 transition-colors duration-150 hover:text-emerald-400"
                  >
                    Tentar novamente
                  </button>
                </p>
              </div>
            </div>
          )}

          <div className="animate-in fade-in duration-500 delay-300 mt-6 flex justify-center">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-[12px] text-white/30 transition-colors duration-150 hover:text-white/60"
            >
              <ArrowLeft size={13} />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>

      <p className="animate-in fade-in duration-700 delay-500 absolute bottom-5 text-[11px] text-white/15">
        © {new Date().getFullYear()} Orderly. Todos os direitos reservados.
      </p>
    </div>
  );
}
