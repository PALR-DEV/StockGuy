FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine as runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/main.js" ]