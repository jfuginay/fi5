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
      email?: string;
      name?: string;
      role: UserRole;
      groupId: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    groupId: number;
  }
}

export const authOptions: NextAuthOptions = {
  theme: {
    colorScheme: "light",
    brandColor: "#319795",
  },
  callbacks: {
    // Your existing callbacks remain the same
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.groupId = user.groupId;
      }
      return session;
    },
    signIn: async ({ user, account }) => {
      // Your existing signIn logic remains the same
      return true;
    },
  },
  
  // Use PrismaAdapter with the new database connection
  adapter: PrismaAdapter(prisma),
  
  providers: [
    Email({
      server: {
        host: env.EMAIL_HOST,
        port: Number(env.EMAIL_PORT),
        auth: {
          user: env.EMAIL_USERNAME,
          pass: env.EMAIL_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
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
          from: from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, theme }),
        });

        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    Okta({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
    }),
  ],
};

// The rest of your code (getServerAuthSession, html, and text functions) remains the same
