FROM --platform=linux/amd64 node:16-alpine3.17 AS base
RUN apk add --no-cache libc6-compat openssl1.1-compat
RUN apk update
RUN npm install -g turbo pnpm


FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=@prisma-editor/web --docker


FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm web postinstall
RUN pnpm turbo run build --filter=@prisma-editor/web
CMD [ "pnpm","start" ] 

# TODO: fix Cannot find module 'next/dist/server/next-server' & remove CMD [ "pnpm","start" ] 
# FROM --platform=linux/amd64 node:16-alpine3.17 AS runner
# WORKDIR /app
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs
# COPY --from=installer /app/apps/web/next.config.mjs .
# COPY --from=installer /app/apps/web/package.json .
# COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone .
# COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
# CMD node server.js