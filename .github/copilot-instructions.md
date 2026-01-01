<!-- Copilot / AI agent instructions for the simple-shop NestJS project -->
# Guidance for AI coding agents

Purpose: quickly orient an AI contributor to be productive in this NestJS + Prisma monorepo slice.

- **Big picture**: this is a NestJS HTTP API app located in the `simple-shop` folder. The app is modular: key modules live in `src/modules` and include `auth`, `user`, `product`, `order`, `file`, and `database`. The application bootstrap is `src/main.ts` and module wiring is in `src/app.module.ts`.

- **Service boundaries & data flow**:
  - `DatabaseModule` encapsulates Prisma client usage; generated client lives under `generated/prisma` and schema under `prisma/schema.prisma`.
  - `AuthModule` provides global guards (see `src/app.module.ts` where `APP_GUARD` is bound to `AuthGuard` and `RolesGuard`) — authentication/authorization is handled centrally.
  - Controllers live under `src/modules/*/*.controller.ts`, business logic in `*.service.ts`, DTOs under `dto/` and entity-like types under `entities/`.

- **Project-specific patterns** (examples):
  - Global guards are registered in `src/app.module.ts` (both `AuthGuard` and `RolesGuard`). When adding auth behavior, update these guards rather than sprinkling auth checks throughout controllers.
  - Validation: there is a Zod-based pipe at `src/pipe/zod-validation.pipe.ts` — prefer Zod schemas in DTO processing rather than class-validator.
  - Public / role decorators: short-cut route-level access control lives in `src/decorators` (e.g. `public.decorator.ts`, `role.decorato.ts`). Use these when changing route access rules.
  - File uploads/images: image handling is done in `src/modules/file` with an `imagekit.provider.ts` — use this provider for uploads rather than ad-hoc external calls.

- **Build / run / test workflows** (from `simple-shop/package.json`):
  - Install dependencies: `npm install` (run from `simple-shop`).
  - Start dev server with hot reload: `npm run dev` (uses `cross-env` and `nest start --watch`). Recommended for local development on Windows.
  - Build: `npm run build` (produces `dist/`).
  - Run tests: `npm run test` (unit), `npm run test:e2e` (e2e using `test/jest-e2e.json`).
  - Seed DB: `npm run seed` runs `tsx src/seeds/seed.ts` — useful to create initial test data.

- **Prisma & generated client**:
  - Prisma schema: `prisma/schema.prisma`.
  - Generated client included under `generated/prisma`. If you regenerate Prisma client, follow the repository's pattern (watch for generated client placement).

- **Where to look for common changes**:
  - Add new API endpoints: `src/modules/<feature>/<feature>.controller.ts` and service in `<feature>.service.ts`.
  - Auth/roles: `src/modules/auth/guards/*` and `src/decorators`.
  - Shared utilities: `src/utils/*` (money formatting, api utils, etc.).
  - Seeds and test fixtures: `src/seeds`.

- **Conventions & gotchas discovered**:
  - The app uses `BigInt.prototype.toJSON` override in `src/main.ts` to serialize BigInt values — be mindful when altering JSON handling.
  - Some npm scripts include leading spaces for `NODE_ENV=...` (e.g. `"start": " NODE_ENV=production nest start"`). Prefer `npm run dev` for cross-platform dev; avoid assuming those production scripts run on plain Windows CMD without `cross-env`.

- **Quick examples**:
  - Where controllers and services live: `src/modules/order/order.controller.ts`, `src/modules/order/order.service.ts`.
  - Zod validation pipe: `src/pipe/zod-validation.pipe.ts`.

When unsure: open `src/app.module.ts` to see which modules are imported and which global providers (guards) are configured — this file is the canonical starting point for understanding system wiring.

If you want more detail on any area (testing, DB migrations, seeds, or auth flow), ask and I will extend this file with concrete examples and commands.
