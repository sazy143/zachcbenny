############################
# Build stage
############################
FROM node:20-bookworm-slim AS build

# Enable pnpm via Corepack and pin the version from package.json
ENV PNPM_HOME="/opt/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
    && corepack prepare pnpm@9.11.0 --activate

WORKDIR /app

# Copy manifest files first to leverage Docker layer caching for deps
COPY package.json pnpm-lock.yaml ./

# Install dependencies defined in the lockfile for reproducible builds
RUN pnpm install --frozen-lockfile

# Copy the rest of the project and build the static site
COPY . .
RUN pnpm build

############################
# Optional dev target (use: --target dev)
############################
FROM node:20-bookworm-slim AS dev
ENV PNPM_HOME="/opt/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
    && corepack prepare pnpm@9.11.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 4321
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

############################
# Runtime stage (static) - default/final
############################
FROM nginx:alpine AS runtime

# Copy built site from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Use nginx default command
