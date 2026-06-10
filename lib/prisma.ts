import { PrismaClient } from "@/lib/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 3,
    // Supabase pooler는 콜드 상태에서 커넥션 수립에 5초 가까이 걸릴 수 있어
    // 타임아웃을 여유 있게 두고, idle 커넥션도 바로 끊지 않고 재사용한다.
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000,
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
