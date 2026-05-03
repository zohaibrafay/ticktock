import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { mockUsers } from "@/data/mock-users";
import { AUTH } from "./constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const user = mockUsers.find(
          (u) => u.email === credentials?.email && u.password === credentials?.password,
        );
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: { signIn: AUTH.SIGN_IN_PAGE },
  session: { strategy: "jwt", maxAge: AUTH.SESSION_MAX_AGE },
  secret: AUTH.SECRET,
  trustHost: true,
});
