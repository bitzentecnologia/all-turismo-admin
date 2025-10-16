# AGENTS.md

## Commands

**Setup:**
```bash
npm install
```

**Build:** `npm run build`  
**Lint:** `npm run lint`  
**Test:** `npm test`  
**Dev Server:** `npm start` (or `npm run start:dev` for hosted API, `npm run start:local` for localhost API)

## Tech Stack & Architecture

- **Angular 20.2** with Angular Material 20, TypeScript 5.9, SCSS
- **Structure:** `src/app/{core, shared, features, layouts}` - core contains services/guards/interceptors/models, shared has reusable components/directives/pipes, features has feature modules, layouts has app layouts
- **Testing:** Jasmine + Karma
- **Linting:** Angular ESLint 20
- **Formatting:** Prettier 3

## Code Style

- **Naming:** Components/services use `kebab-case`, interfaces use `PascalCase`, constants use `UPPER_SNAKE_CASE`
- **Prettier config:** 2 spaces, single quotes, semicolons, 100 print width, ES5 trailing commas
- **ESLint:** Unused vars with `_` prefix allowed, `console.warn/error` allowed
- **Imports:** Organized by type (Angular, Material, third-party, local)
