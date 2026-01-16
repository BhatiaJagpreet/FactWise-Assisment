# FactWise Dashboard

Employee management dashboard built with Next.js and React.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- Employee DataTable with search, filter, and pagination
- Department-wise filtering
- Add/Edit/Delete employees
- Analytics page with charts (Recharts)
- Settings page
- Responsive design

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion
- React Hook Form + Zod

## Project Structure

```
src/
├── app/           # Pages (dashboard, analytics, settings)
├── components/    # UI components
├── data/          # Sample employee data
├── lib/           # Utility functions
└── types/         # TypeScript types
```

## Scripts

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```
