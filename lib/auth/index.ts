import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import authConfig from "./config";
import { compare } from "bcrypt";
import { db, users } from "../schema";
import { eq } from "drizzle-orm";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {}
        if (!email || !password) {
          throw new Error("Missing email or password");
        }
        const user = await db.query.users.findFirst({
            where: eq(users.email, email as string),
          });
        // if user doesn't exist or password doesn't match
        if (!user || !user.password || !(await compare(password as string, user.password))) {
          throw new Error("Invalid email or password")
        }
        return user;
      },
    })
  ]
});
