import {PrismaAdapter} from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        fname: { label: "First Name", type: "text" },
        lname: { label: "Last Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Untuk register (jika ada fname dan lname)
        if (credentials?.fname && credentials?.lname) {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const user = await prisma.user.create({
            data: {
              name: `${credentials.fname} ${credentials.lname}`,
              firstName: credentials.fname,
              lastName: credentials.lname,
              email: credentials.email,
              password: hashedPassword,
              role: 'user' // Default role
            }
          });
          return {
            id: user.id,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          };
        }
        
        // Untuk login (hanya email dan password)
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Email tidak ditemukan.");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Password salah.");
        }

        return {
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          role: token.role,
          name: token.name,
          firstName: token.firstName,
          lastName: token.lastName,
          email: token.email
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};