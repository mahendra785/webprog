import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// ✅ Get session correctly
export const auth = async () => {
  return await getServerSession(authOptions);
};

// ✅ Sign in function (handled in frontend)
export const signIn = async () => {
  return "/api/auth/signin";
};

// ✅ Sign out function (handled in frontend)
export const signOut = async () => {
  return "/api/auth/signout";
};
