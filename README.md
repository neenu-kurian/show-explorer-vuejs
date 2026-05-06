# Show Explorer

A Vue3 application that displays shows based on genres and allows for searching and exploring TV shows, built with Vue 3 and TypeScript. Discover show details, cast information, and browse collections.

You can find the application here: https://show-explorer-vue.vercel.app/ 

![alt text](image-1.png)
![alt text](image.png)

## Tech Stack & Architecture Decisions

### Core Technologies

* *Vue 3 & TypeScript*: Uses the Composition API for type-safe development.
 * *Vite*: Provides a fast development environment and build process.
 * *Pinia*: Manages global state with a focus on simplicity and TypeScript support.
 * *Tailwind CSS*: Handles styling through utility classes.
 * *Zod*: Validates API data to ensure it matches expected formats.
 * *Vitest & Playwright*: Used for unit and end-to-end testing.
## Project Structure
 * *components/*: Reusable UI elements.
 * *composables/*: Reusable logic and functions.
 * *services/*: API communication logic.
 * *stores/*: Global state management (Pinia).
 * *views/*: Page-level components.
 * *types/*: TypeScript definitions.
 * *shared/*: Common utilities and helpers.
 * *router/*: route definitions

### Testing & Code Quality
- **ESLint + Prettier** — Enforced code standards and formatting.

This project was developed using:
- **Node.js**: v24.13.0
- **npm**: v11.6.2

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:neenu-kurian/Show-Explorer-Vue.git
   cd show-explorer-vue
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

### Development Server
```bash
npm run dev
```
Starts a local dev server at `http://localhost:5173` (or similar). Hot module reloading enabled.

### Build for Production
```bash
npm run build
```
Creates an optimized build in the `dist/` directory.

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production with type-checking |
| `npm run type-check` | Run TypeScript compiler |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |

## Key Features
 * *Data Reliability*: Uses Zod and TypeScript to catch data errors early.
 * *Logic Separation*: Business logic is kept in composables to keep components clean.
 * *Efficiency*: Includes features like lazy loading, search debouncing, and data caching to improve performance.