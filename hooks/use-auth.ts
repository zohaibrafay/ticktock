"use client";

import { useCallback, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { loginSchema, extractErrors } from "@/lib/schemas";
import { AppError, ValidationError, isAppError } from "@/lib/errors";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const loginController = useCallback(async (email: string, password: string) => {
    const validateByZod = loginSchema.safeParse({ email, password });
    if (!validateByZod.success) {
      const err = new ValidationError("Invalid credentials", extractErrors(validateByZod.error));
      setError(err);
      return { ok: false as const, error: err };
    }
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        const err = new AppError("UNAUTHORIZED", "Invalid email or password.", 401);
        setError(err);
        setLoading(false);
        return { ok: false as const, error: err };
      }
      router.push("/dashboard");
      return { ok: true as const, error: null };
    } catch (e) {
      const err = isAppError(e) ? e : new AppError("UNKNOWN", String(e));
      setError(err);
      setLoading(false);
      return { ok: false as const, error: err };
    }
  }, []);

  const logoutController = useCallback(async () => {
    setLoading(true);
    await signOut({ redirect: false });
    router.push("/login");
  }, []);
  return {user: session?.user ?? null , isLoading: status === "loading" || loading , error , loginController,logoutController,clearError: useCallback(() => setError(null), []),};
}
