import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook"
import { DrizzleAdapter } from "@auth/drizzle-adapter";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt"; //import is used in module declaration
/* eslint-enable @typescript-eslint/no-unused-vars */
import { type Roles } from "@/lib/db/schema";
import { db } from "../db";

declare module "next-auth" {
    interface User {
        roles?: Roles
        firstName?: string | null,
        lastName?: string | null,
    }
    interface Token {
        roles?: Roles,
        firstName?: string | null,
        lastName?: string | null,
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        roles?: Roles,
        firstName?: string | null,
        lastName?: string | null,
    }
}

export default {
    providers: [
        GoogleProvider({
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name || profile.email,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    email: profile.email,
                    image: profile.picture,
                }
            }
        }),
        Facebook({
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    email: profile.email,
                    image: profile.picture.data.url,
                }
            }
        })
    ],
    pages: {
        signIn: `/login`,
        verifyRequest: `/login`,
        error: "/login", // Error code passed in query string as ?error=
    },
    adapter: DrizzleAdapter(db),
    session: { strategy: "jwt" },
    theme: {
        colorScheme: "auto", // "auto" | "dark" | "light"
        brandColor: "#3bde2c", // Hex color code
        logo: `https://www.prospectorminerals.com/_next/image?url=%2FPM-Favicon-New-Square.png&w=128&q=75`, // Todo: upload image and change Absolute URL to image
        buttonText: "#FFFFFF" // Hex color code
    },
    callbacks: {
        jwt: async ({ token, user, trigger, session }) => {
            if (user) {
                token.roles = user.roles;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }
            if (trigger === "update") {
                const sessionKeyList = Object.keys(session);
                sessionKeyList.forEach(async (key) => {
                    token[key] = session[key];
                });
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user = {
                ...session.user,
                roles: token?.roles,
                firstName: token?.firstName,
                lastName: token?.lastName,
                ...(token.sub && { id: token.sub }),
            };
            return session;
        }
    }

} satisfies NextAuthConfig