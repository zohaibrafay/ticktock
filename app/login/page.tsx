"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import FormField from "@/components/ui/FormField";
import { ArrowRight } from "lucide-react";
import { LoginInput } from "@/lib/schemas";
import { ValidationError } from "@/lib/errors";
export default function LoginPage() {
  const { loginController, isLoading, error, clearError } = useAuth();
  const [loginForm, setLoginForm] = useState<LoginInput>({ email: "", password: "", rememberMe: false });
  function set(formField: string, value: string | boolean) {
    setLoginForm((p) => ({ ...p, [formField]: value }));
    clearError();
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await loginController(loginForm.email, loginForm.password).then((result) => !result.ok && setLoginForm({ ...loginForm, email: "", password: "" }));
  }
  const getFieldError = (field: string) => error instanceof ValidationError ? error.errors[field] : undefined;
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-16">
        <div className="mx-auto w-full">
          <h1 className="mb-2 text-xl font-bold text-foreground">Welcome back</h1>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField id="email" label="Email" type="email" placeholder="name@example.com" value={loginForm.email} error={getFieldError("email")} onChange={(v) => set("email", v)} />
            <FormField id="password" label="Password" type="password" placeholder="••••••••" value={loginForm.password} error={getFieldError("password")} onChange={(v) => set("password", v)} />
            <div className="flex items-center">
              <input id="remember" type="checkbox" checked={loginForm.rememberMe} onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer"> Remember me</label>
            </div>
            {error && !(error instanceof ValidationError) && (<div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive animate-in fade-in slide-in-from-top-2">{error.message}</div>)}
            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
              {isLoading ? "Signing in..." : (<>Sign in <ArrowRight size={16} /></>)}
            </button>
          </form>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 flex-col justify-center gradient-bg px-14 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="mb-4 text-[40px] font-bold leading-tight text-white"> ticktock</h2>
          <p className="text-[16px] leading-relaxed text-white/70">
            Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}
