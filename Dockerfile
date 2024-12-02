FROM node:18-alpine AS build

# Install dependencies only when needed
FROM build AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM build AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NODE_ENV='production'
ENV NODE_ENV=$NODE_ENV

ARG NEXT_PUBLIC_COMMERCIFY_API_URL="https://dev.commercify.app/api/v1"
ENV NEXT_PUBLIC_COMMERCIFY_API_URL=$NEXT_PUBLIC_COMMERCIFY_API_URL

ARG NEXT_PUBLIC_DEV_COMMERCIFY_API_URL="http://localhost:6091/api/v1"
ENV NEXT_PUBLIC_DEV_COMMERCIFY_API_URL=$NEXT_PUBLIC_DEV_COMMERCIFY_API_URL

RUN echo "Application is running in ${NODE_ENV} mode"

RUN npm run build

# Production image, copy all the files and run next
FROM build AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/src/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]