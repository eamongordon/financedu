import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import authConfig from "./config";
import { compare } from "bcrypt";
import { users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    signIn: async ({ user, email }) => {
      if (email?.verificationRequest) {
        const userExists = await db.query.users.findFirst({
          where: eq(users.email, user.email as string),
        });
        if (userExists) {
          return true;   //if the email exists in the User table, email them a magic login link
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  },
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
    }),
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async function sendVerificationRequest(params) {
        const { identifier, url, provider, theme } = params
        const { host } = new URL(url)
        const transport = createTransport(provider.server)
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Log In to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, theme }),
        })
        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
        }
      }
    }),
  ]
});

interface Theme {
  colorScheme?: "auto" | "dark" | "light"
  logo?: string
  brandColor?: string
  buttonText?: string
}

function html(params: { url: string, host: string, theme: Theme }) {
  const { url, host, theme } = params


  const escapedHost = host.replace(/\./g, "&#8203;.")


  const brandColor = theme.brandColor || "#346df1";
  const buttonText = theme.buttonText || "#fff";


  const color = {
    background: "#f9f9f9",
    text: "#444",
    textDark: "#fff",
    mainBackground: "#fff",
    mainBackgroundDark: "#000",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: buttonText
  }


  return `
  <html lang="en" style="color-scheme: light dark;">
    <body style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark;">
      <table width="100%" border="0" cellspacing="20" cellpadding="0"
        style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center" style="padding: 10px 0px; font-size: 22px;">
            <img src=${theme.logo} width="55" height="55" alt="Prospector Minerals Logo">
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark});">
            Log In to <strong>${escapedHost}</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark})">
            You can reset your password once logged in.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                  <a href="${url}" target="_blank"
                    style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                    Log In
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark})">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string, host: string }) {
  return `Log In to ${host}\n${url}\n\n`
}