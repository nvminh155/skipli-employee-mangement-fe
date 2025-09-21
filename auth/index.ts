import authService from "@/services/auth.service";
import { TAuthLogin } from "@/types/auth";
import { EUserRole } from "@/types/user";
import NextAuth, {
  NextAuthConfig,
  User,
  type DefaultSession,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      avatar?: string;
      role: EUserRole;
      userId: string;
      fullName: string;
    } & DefaultSession["user"];
  }

  interface User {
    token: string;
    avatar?: string;
    fullName: string;
    role: EUserRole;
    userId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    avatar?: string;
    fullName: string;
    role: EUserRole;
    userId: string;
  }
}

export enum EUpdateSession {
  SIGN_OUT,
}

export const BASE_PATH = "/api/auth";

const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const { username, password } = credentials ?? {};
        console.log("authorize", credentials);

        if (typeof password !== "string" || typeof username !== "string")
          throw new Error("Must be a string");

        try {
          const res = await authService.verifyCode(username, password);

          if (res) {
            const { fullName, email, role, id } = res ?? {};

            return {
              fullName: fullName,
              email,
              role,
              userId: id,
              token: res.token,
              id,
            };
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, trigger, user, session }) {
      if (user) {
        token.token = user.token;
        token.role = user.role;
        token.fullName = user.fullName;
        token.email = user.email;
        token.userId = user.userId;
        token.id = user.id;
      }
      token.exp = Math.floor(Date.now() / 1000) + (60 * 60);
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          token: token.token,
          role: token.role,
          fullName: token.fullName,
          email: token.email,
          userId: token.userId,
        },
      };
    },
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
