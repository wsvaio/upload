FROM oven/bun:alpine as builder

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

FROM oven/bun:alpine as prod

WORKDIR /app

COPY --from=builder /app/.output .
EXPOSE 3000

CMD ["bun", "server/index.mjs"]