FROM node:20-bookworm-slim AS base

# Install tooling often required when running Codex plans inside the container
RUN apt-get update \
    && apt-get install -y --no-install-recommends git openssh-client python3 python3-pip build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm via Corepack and pin the version from package.json
ENV PNPM_HOME="/opt/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
    && corepack prepare pnpm@9.11.0 --activate

WORKDIR /workspace

# Copy manifest files first to leverage Docker layer caching for dependencies
COPY package.json pnpm-lock.yaml ./

# Install dependencies defined in the lockfile for reproducible builds
RUN pnpm install --frozen-lockfile

# Bring in the rest of the source tree
COPY . .

# Default to an interactive shell so you can invoke `codex plan`, pnpm scripts, etc.
CMD ["bash"]
