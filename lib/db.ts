import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const getPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaInstance = getPrismaClient();
} else {
  // Auto-detect missing tables from development cache and recreate client
  if (!globalForPrisma.prisma || !('alertEmail' in globalForPrisma.prisma)) {
    globalForPrisma.prisma = getPrismaClient();
  }
  prismaInstance = globalForPrisma.prisma;
}

export const db = prismaInstance;
