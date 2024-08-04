FROM --platform=linux/amd64 node:16-alpine3.17 AS base
RUN apk add --no-cache libc6-compat openssl1.1-compat
RUN apk update
RUN npm install -g turbo pnpm


FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=@prisma-editor/web --docker


FROM base AS installer
ARG SKIP_ENV_VALIDATION=true
ARG NEXT_TELEMETRY_DISABLED=1
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
