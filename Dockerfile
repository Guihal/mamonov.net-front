# ── Stage 1: Install dependencies ──
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ── Stage 2: Build ──
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NUXT_PUBLIC_IS_BATTLE_API
ENV NUXT_PUBLIC_IS_BATTLE_API=${NUXT_PUBLIC_IS_BATTLE_API}

ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN pnpm build

# ── Stage 3: Production ──
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/.output ./.output

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
