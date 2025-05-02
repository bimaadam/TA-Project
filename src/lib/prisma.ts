import { PrismaClient } from "@prisma/client";

declare global {
  // INI emang wajib pake `var`, dan aman di TypeScript
  const prismat: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };
