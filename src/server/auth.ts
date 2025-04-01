import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  Theme,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import Email from "next-auth/providers/email";
import { type UserRole } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import Okta from "next-auth/providers/okta";
import FacebookProvider from "next-auth/providers/facebook";
import { createTransport } from "nodemailer";

// Module augmentation remains the same
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: UserRole;
      groupId: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    groupId: number;
  }
}

// Type-safe email template parameters
interface EmailTemplateParams {
  url: string;
  host: string;
  theme?: Theme;
}

export const authOptions: NextAuthOptions = {
  theme: {
    colorScheme: "light",
    brandColor: "#319795",
  },
  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role as UserRole;
        session.user.groupId = user.groupId;
      }
      return session;
    },
    signIn: async ({ user, account }) => {
      return true;
    },
  },
  
  adapter: PrismaAdapter(prisma),
  
  providers: [
    Email({
      server: {
        host: env.EMAIL_HOST || "",
        port: Number(env.EMAIL_PORT) || 587,
        auth: {
          user: env.EMAIL_USERNAME || "",
          pass: env.EMAIL_PASSWORD || "",
        },
      },
      from: env.EMAIL_FROM || "noreply@example.com",
      sendVerificationRequest: async ({
        identifier: email,
        provider: { server, from },
        url,
        theme,
      }) => {
        const { host } = new URL(url);
        const transport = createTransport(server);
        const result = await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, theme: theme || {} }),
        });

        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
    // Only add providers if the environment variables are defined
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(env.AUTH0_CLIENT_ID && env.AUTH0_CLIENT_SECRET && env.AUTH0_ISSUER
      ? [
          Okta({
            clientId: env.AUTH0_CLIENT_ID,
            clientSecret: env.AUTH0_CLIENT_SECRET,
            issuer: env.AUTH0_ISSUER,
          }),
        ]
      : []),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

// Email HTML body
function html({ url, host, theme = {} }: EmailTemplateParams): string {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML)
function text({ url, host }: EmailTemplateParams): string {
  return `Sign in to ${host}\n${url}\n\n`;
}
