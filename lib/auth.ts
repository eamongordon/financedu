import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { sendForgotPasswordEmail } from "./actions/emails";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true
    }),
    user: {
        additionalFields: {
            firstName: {
                type: "string",
                required: false
            },
            lastName: {
                type: "string",
                required: false
            },
            roles: {
                type: "string[]",
                required: false
            }
        },
        deleteUser: {
            enabled: true
        }
    },
    session: {
        freshAge: 0
    },
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            await sendForgotPasswordEmail({
                email: user.email,
                url: url
            })
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            mapProfileToUser: (profile) => {
                return {
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                };
            },
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
        }
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "facebook"]
        }
    }
});

export async function getSession() {
    const hdrs = await headers();
    return auth.api.getSession({ headers: hdrs });
}