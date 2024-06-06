import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const adiminEmail = ["kdprajapati3002@gmail.com"];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    session: ({ session, token, user }) => {
      // console.log(session, token, user);

      if (adiminEmail.includes(session?.user?.email)) {
        return session;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  let session = await getServerSession(req, res, authOptions);

  if (!adiminEmail?.includes(session?.user?.email)) {
    throw "not an admin";
  }
}
