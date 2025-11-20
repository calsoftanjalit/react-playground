# React Playground

A modern React application built with Vite, TypeScript, and a comprehensive tech stack.

## Tech Stack

- **Build Tool**: Vite
- **Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Mantine (@mantine/core, @mantine/hooks, @mantine/notifications)
- **Data Fetching**: TanStack React Query (+ devtools)
- **Styling**: Tailwind CSS + SCSS Modules
- **Testing**: Vitest + Testing Library (@testing-library/react, @testing-library/jest-dom)
- **Test Environment**: happy-dom
- **Coverage**: @vitest/coverage-v8

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v10 or higher)

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Testing

Run tests:

```bash
npm test
```

Run tests with interactive UI and coverage:

```bash
npm run test:ui
```

Run tests with terminal coverage report:

```bash
npm run test:coverage
```

#### Test Coverage Reporting

The project includes comprehensive test coverage reporting using Vitest and V8 coverage provider.

- Coverage reports are generated in the `./coverage` directory
- Non-testable files (styles, configs, test files, types) are excluded from coverage

### Linting

Run ESLint:

```bash
npm run lint
```

## Project Structure

```
react-playground/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, icons, etc.
│   ├── components/  # React components
│   │   ├── *.tsx           # Component files
│   │   ├── *.test.tsx      # Component tests
│   │   └── *.module.scss   # SCSS modules
│   ├── test/        # Test utilities and setup
│   ├── App.tsx      # Main App component
│   ├── main.tsx     # Application entry point
│   └── index.css    # Global styles (with Tailwind)
├── index.html       # HTML template
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json     # Project dependencies
```

## Features Demonstrated

1. **Mantine UI Components**: Cards, Buttons, Text, Notifications
2. **TanStack React Query**: Data fetching with loading and error states
3. **Tailwind CSS**: Utility-first CSS classes
4. **SCSS Modules**: Component-scoped styles with nesting
5. **Vitest + Testing Library**: Component testing with happy-dom and coverage reporting

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with interactive UI and coverage
- `npm run test:coverage` - Run tests with terminal coverage report
- `npm run lint` - Run ESLint

## License

This project is a playground for testing and learning purposes.