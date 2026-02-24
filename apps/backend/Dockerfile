FROM oven/bun:1.2-alpine

WORKDIR /app

# Copy workspace manifests for deterministic install
COPY package.json bun.lockb ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

RUN bun install --frozen-lockfile

# Copy source
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

# Generate Prisma client
RUN cd apps/backend && bunx prisma generate

# Build
RUN cd apps/backend && bun run build

EXPOSE 3000

# Run migrations then start
CMD ["sh", "-c", "cd apps/backend && bunx prisma migrate deploy && bun run start"]
