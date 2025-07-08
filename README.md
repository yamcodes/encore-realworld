<div align="center">

<h1>Encore RealWorld</h1>

[![License](https://custom-icon-badges.demolab.com/github/license/yamcodes/encore-realworld?label=License&color=blue&logo=law&labelColor=0d1117)](https://github.com/yamcodes/encore-realworld/blob/main/LICENSE)
[![Encore.ts](https://custom-icon-badges.demolab.com/badge/Encore.ts-eeeee1.svg?logo=encore)](https://encore.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Biome](https://img.shields.io/badge/Biome-24272f?logo=biome&logoColor=f6f6f9)](https://biomejs.dev/)
[![Star](https://custom-icon-badges.demolab.com/github/stars/yamcodes/encore-realworld?logo=star&logoColor=373737&label=Star)](https://github.com/yamcodes/encore-realworld/stargazers/)

**Encore.ts + Prisma implementation of the [RealWorld API Spec](https://github.com/gothinkster/realworld/tree/main/api)**

</div>

## What is this?

This project is a fullstack implementation of the [RealWorld](https://github.com/gothinkster/realworld) backend API using [Encore.ts](https://encore.dev/docs/ts) and [Prisma](https://www.prisma.io/). It demonstrates modern TypeScript, API design, and database best practices in a real-world scenario.

- **Encore.ts**: Cloud-native backend framework for TypeScript
- **Prisma**: Type-safe ORM for PostgreSQL
- **Biome**: Code quality and formatting

## Project Structure

- `article/`, `comment/`, `user/`, etc.: Feature modules implementing RealWorld API endpoints
- `database/`: Prisma schema, migrations, and database client setup
- `shared/`: Shared constants, utilities, and types
- `encore.gen/`: Encore-generated code (do not edit manually)

## Environment Configuration

- Copy `.env.example` to `.env` and fill in the required values:
  ```bash
  cp .env.example .env
  ```
- Encore and Prisma will use this file for database and other environment variables.

## Development

1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Start Encore in development mode** (provisions DB, runs migrations, starts API server)
   ```bash
   pnpm dev
   ```
3. **Open the local Encore dashboard**
   - Visit the dashboard (URL will be printed in the console) for API docs, traces, and infra.
4. **Open Prisma Studio** (optional, for DB browsing)
   ```bash
   pnpm db:studio
   ```

## Database Management

- **Reset the database** (drops and recreates all tables):
  ```bash
  pnpm db:reset
  ```
- **Generate Prisma client** (after schema changes):
  ```bash
  pnpm db:generate
  ```
- **Push schema to DB** (for prototyping only):
  ```bash
  pnpm db:push
  ```

## Building for Production

Encore handles builds and deployments via its own CLI and cloud platform. See [Encore docs](https://encore.dev/docs/ts/deploy) for details.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines and setup instructions.

---

**Reference:** [RealWorld API Spec](https://github.com/gothinkster/realworld/tree/main/api)
