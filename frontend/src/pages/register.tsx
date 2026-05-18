import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2, User } from "lucide-react";
import logo from "../../assets/logo.svg";
import { authService } from "../lib/auth-service";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerUserSchema = z
  .object({
    name: z.string().min(3, "Um nome válido é obrigatório").trim(),
    email: z.email("E-mail inválido").trim(),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterUserFormType = z.infer<typeof registerUserSchema>;

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormType>({
    resolver: zodResolver(registerUserSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ data }) => {
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    },
  });

  function onSubmit(data: RegisterUserFormType) {
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
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

          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150 mb-7">
            <h1 className="text-[17px] font-medium tracking-tight text-white">
              Criar conta
            </h1>
            <p className="mt-1 text-sm text-white/38">
              Preencha os dados abaixo para começar.
            </p>
          </div>

          {/* Tratamento de erro idêntico ao do Login */}
          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-4 rounded-lg border border-red-500/20 bg-red-500/08 px-3.5 py-2.5">
              <p className="text-sm text-red-400">
                {(error as any).response?.data?.message || error.message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Nome */}
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200 space-y-1.5">
              <label
                htmlFor="name"
                className="block text-[11px] font-medium uppercase tracking-widest text-white/40"
              >
                Nome completo
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  {...register("name")}
                  className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/20 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/10"
                      : "border-white/[0.08] focus:border-emerald-500/40 focus:bg-white/[0.06] focus:ring-emerald-500/10"
                  }`}
                />
                <User
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20"
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-red-400/80">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-[250ms] space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[11px] font-medium uppercase tracking-widest text-white/40"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/10"
                    : "border-white/[0.08] focus:border-emerald-500/40 focus:bg-white/[0.06] focus:ring-emerald-500/10"
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-400/80">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300 space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[11px] font-medium uppercase tracking-widest text-white/40"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/20 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/10"
                      : "border-white/[0.08] focus:border-emerald-500/40 focus:bg-white/[0.06] focus:ring-emerald-500/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition-colors duration-150 hover:text-white/55"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400/80">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar senha */}
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-[350ms] space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-[11px] font-medium uppercase tracking-widest text-white/40"
              >
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`w-full rounded-lg border bg-white/[0.04] px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/20 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/10"
                      : "border-white/[0.08] focus:border-emerald-500/40 focus:bg-white/[0.06] focus:ring-emerald-500/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition-colors duration-150 hover:text-white/55"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400/80">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-[400ms] pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-[#090d0b] transition-all duration-200 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    Criar conta
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="animate-in fade-in duration-500 delay-[450ms] my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[11px] text-white/20">ou</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <p className="animate-in fade-in duration-500 delay-500 text-center text-sm text-white/30">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-medium text-white/65 transition-colors duration-150 hover:text-white"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>

      <p className="animate-in fade-in duration-700 delay-500 absolute bottom-5 text-[11px] text-white/15">
        © {new Date().getFullYear()} Orderly. Todos os direitos reservados.
      </p>
    </div>
  );
}
