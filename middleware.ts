/** Route protection — redirects unauthenticated users to /login. */
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*"],
};
