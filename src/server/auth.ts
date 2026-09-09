import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import { type DefaultSession, getServerSession, type NextAuthOptions, type User } from "next-auth";
import { type AdapterUser } from "next-auth/adapters";
import { type JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

// user is defined if it comes right from OAuth login, so the info is fresh from gh
const login = (token: JWT, user: AdapterUser | User) => {
  token.id = user.id;
  token.name = user.name;
  token.email = user.email;
  token.picture = user.image;
  return token;
}

// refresh path with valid (previously authenticated) token
const refreshToken = async (token: JWT) => {
  const dbUser = await prisma.user.findUnique({
    where: { id: token.id },
  });

  if (!dbUser) {
    return token;
  }

  return {
    ...token,
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    picture: dbUser.image,
  };
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },

    // to add `id` to the user session
    async jwt({ token, user }) {
      if (user) {
        return login(token, user)
      }

      // malformed token/corrupted state
      if (!token.id) {
        return token;
      }

      return (await refreshToken(token));
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
