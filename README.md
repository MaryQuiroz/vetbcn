# VetBCN 🐾

> **Find the perfect vet in Barcelona** — directory of veterinary clinics with interactive maps, advanced filters, and real-time open/closed status.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://prisma.io)

---

## Overview

VetBCN is a full-stack web application that helps pet owners in Barcelona find veterinary clinics. It provides an interactive map view, advanced filtering by neighborhood and specialty, geolocation-based sorting, and a favorites system — all powered by real data from the city of Barcelona's open data portal.

---

## Screenshots

| Listado | Detalle de clínica |
|---|---|
| ![Home](./public/screenshots/home.png) | ![Clinic detail](./public/screenshots/clinic-detail.png) |

---

## Features

- **Interactive Map** — Leaflet-powered map with clickable clinic markers across Barcelona
- **Advanced Filters** — Filter by neighborhood (*barrio*), specialty, animal type, language, price level, and emergency availability
- **Geolocation Sorting** — Sort clinics by distance from your current location
- **Clinic Detail Pages** — Full profile with address, phone, opening hours, specialties, reviews, and an embedded map
- **Reviews & Ratings** — Star ratings and user comments with helpful votes
- **Favorites** — Save and manage favorite clinics (persisted in `localStorage`)
- **Directions** — Quick access to directions for any clinic
- **Emergency Float** — Persistent button to instantly find emergency clinics
- **Open/Closed Status** — Real-time open status derived from clinic hours
- **Open Data Import** — Data pipeline to import and sync clinic data from the Barcelona open data portal

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, SSR) |
| UI | React 19 + Tailwind CSS 4 |
| Language | TypeScript 5 |
| Database | PostgreSQL 16 |
| ORM | Prisma 7 |
| Maps | React Leaflet 5 + Leaflet 1.9 |
| Infrastructure | Docker Compose |

---

## Project Structure

```
vetbcn/
├── prisma/
│   ├── schema.prisma           # DB schema — Clinic + Review models
│   ├── seed.ts                 # Static seed data
│   ├── seed-reviews.ts         # Review seed data
│   └── import-opendata.ts      # Barcelona open data importer
├── src/
│   ├── app/
│   │   ├── page.tsx            # Home page (clinic listing)
│   │   ├── layout.tsx          # Root layout with Header/Footer
│   │   ├── loading.tsx         # Skeleton loading UI
│   │   ├── error.tsx           # Global error boundary
│   │   ├── [slug]/             # Dynamic clinic detail pages
│   │   └── api/clinics/        # REST API routes
│   ├── components/
│   │   ├── ClinicCard.tsx      # Clinic summary card
│   │   ├── ClinicMap.tsx       # Map overview (dynamic import)
│   │   ├── ClinicMapInner.tsx  # Leaflet map implementation
│   │   ├── ClinicDetailMap.tsx # Single-clinic detail map
│   │   ├── FilterSidebar.tsx   # Filter panel (barrio, specialty…)
│   │   ├── SearchBar.tsx       # Text search input
│   │   ├── GeoSortBar.tsx      # Sort by geolocation distance
│   │   ├── FavoritesDrawer.tsx # Saved clinics drawer
│   │   ├── DirectionsPanel.tsx # Directions to clinic
│   │   ├── EmergencyFloat.tsx  # Floating emergency access button
│   │   ├── ReviewCard.tsx      # Individual review
│   │   ├── ReviewList.tsx      # Review list with pagination
│   │   ├── StarRating.tsx      # Star rating display
│   │   ├── OpenStatusBadge.tsx # Open / Closed indicator
│   │   ├── PriceBadge.tsx      # Price level badge
│   │   ├── PetOnboarding.tsx   # Pet type selection flow
│   │   ├── HeartButton.tsx     # Favorite toggle button
│   │   ├── HomeContent.tsx     # Home page layout orchestrator
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── useFavorites.ts     # Favorites state (localStorage)
│   │   └── useDirections.ts    # Directions logic
│   ├── lib/                    # Prisma client + shared helpers
│   ├── types/                  # Shared TypeScript types
│   └── utils/                  # Pure utility functions
└── docker-compose.yml          # Local PostgreSQL 16 container
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **Docker** (for local PostgreSQL)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/MaryQuiroz/vetbcn.git
cd vetbcn
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vetbcn"
```

**4. Start the database**

```bash
docker compose up -d
```

**5. Run migrations and seed data**

```bash
# Apply database migrations
npx prisma migrate deploy

# Option A — import real data from Barcelona's open data portal
npm run import:opendata

# Option B — use bundled seed data
npx prisma db seed
```

**6. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

### `GET /api/clinics`

Returns a paginated list of clinics. Supports the following query parameters:

| Parameter | Type | Description |
|---|---|---|
| `search` | `string` | Search by name or address |
| `barrio` | `string` | Filter by neighborhood |
| `specialty` | `string` | Filter by medical specialty |
| `animalType` | `string` | Filter by animal type |
| `language` | `string` | Filter by spoken language |
| `price` | `number` | Filter by price level (1–3) |
| `isEmergency` | `boolean` | Show only 24h emergency clinics |

### `GET /api/clinics/[slug]`

Returns full details for a single clinic identified by its unique slug.

---

## Data Model

```prisma
model Clinic {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  address     String
  barrio      String
  phone       String
  email       String?
  website     String?
  description String?
  hours       Json                // { mon: "9:00-20:00", ... }
  specialties String[]
  animalTypes String[]
  languages   String[]
  rating      Float     @default(0)
  reviewCount Int       @default(0)
  price       Int                 // 1 = budget, 2 = mid, 3 = premium
  isEmergency Boolean   @default(false)
  lat         Float?
  lng         Float?
  reviews     Review[]
}

model Review {
  id       String   @id @default(cuid())
  clinicId String
  author   String
  rating   Int
  comment  String
  date     DateTime @default(now())
  helpful  Int      @default(0)
}
```

---

## Available Scripts

```bash
npm run dev              # Start development server (with Turbopack)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run import:opendata  # Import/sync data from Barcelona open data portal
```

---

## License

[MIT](LICENSE)
