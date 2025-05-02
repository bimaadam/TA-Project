import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line no-var
declare global {
  var prisma: PrismaClient | undefined;
}


export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
