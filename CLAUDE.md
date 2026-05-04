# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sogang Ribbon (서강리본)** is a restaurant discovery and review service for restaurants near Sogang University. Users write reviews with photos and keyword tags; the system awards emblems based on review count and runs annual restaurant awards with voting.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript strict — `any` is forbidden
- **Styling**: Tailwind CSS v4 + Shadcn UI (`radix-nova` style, `neutral` base color)
- **Backend/Auth**: Supabase (PostgreSQL, Auth, Storage) — not yet installed
- **Maps**: react-kakao-maps-sdk
- **State/Data**: TanStack Query v5

## Commands

```
npm run dev       # start dev server (http://localhost:3000)
npm run build     # production build
npm run lint      # ESLint
```

No test runner is configured yet.

## Architecture

```
app/              # Next.js App Router — routes and layouts
components/ui/    # Shadcn UI primitives (do not edit directly)
components/       # App-level components (PascalCase filenames)
services/         # Supabase/API calls, organized by domain (to be created)
lib/              # Shared utilities; lib/utils.ts exports cn()
types/            # TypeScript type definitions (to be created)
```

Path alias: `@/*` resolves to the repo root (e.g. `@/lib/utils`).

Naming: `camelCase` for variables/functions, `PascalCase` for component files.

## Key Implementation Notes

**Tailwind v4**: No `tailwind.config.ts`. Theme tokens and CSS variables are defined in `app/globals.css`. Use CSS variables for custom design tokens.

**Shadcn UI**: Add components with `npx shadcn add <component>`. The installed style is `radix-nova`. Do not hand-edit files under `components/ui/` — regenerate instead.

**Next.js version**: This project runs Next.js 16, which has breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing routing or data-fetching code; do not rely on pre-training knowledge of Next.js conventions.

**Kakao Maps**: Requires a Kakao JavaScript API key set as an environment variable. Map components must be client components (`"use client"`).

## Available Claude Skills

- `/init` — scaffold initial directory structure and config files
- `/page [name]` — generate a page skeleton (e.g. `/page main`, `/page mypage`, `/page review`)
- `/erd` — review DB schema and write Supabase queries

## Database Schema

```
erDiagram
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ USER_EMBLEM : "possesses"
    USER ||--o{ PLACE_BOOKMARK : "saves"

    PLACE ||--o{ REVIEW : "has"
    PLACE ||--o{ PLACE_KEYWORD : "tagged with"
    PLACE ||--o{ AWARD_RES : "receives"

    REVIEW ||--o{ REVIEW_IMAGES : "includes"
    REVIEW }o--o{ KEYWORD : "contains"

    KEYWORD ||--o{ PLACE_KEYWORD : "categorizes"

    AWARD_CATEGORY ||--o{ AWARD_RES : "classified by"
    AWARD ||--o{ AWARD_CATEGORY : "belongs to"

    EMBLEM ||--o{ USER_EMBLEM : "granted to"

    USER {
        int id PK
        string pw
        string email
        string nickname
        string profile_url
        int review_cnt
    }

    REVIEW {
        int id PK
        int userid FK
        int placeid FK
        int keyword_id FK "0–3 keywords"
        int rating "5 or 3 stars"
        boolean is_del
        datetime created_at
    }

    REVIEW_IMAGES {
        int id PK
        int reviewid FK
        string img_url
        int sort_order
        datetime created_at
    }

    PLACE {
        int id PK
        float latitude
        float longitude
        string name
        string classification "e.g. Korean, Western"
        string img_url
        int ribbon_cardinal
        int ribbon_deepred
        int ribbon_pink
    }

    KEYWORD {
        int keyword_id PK
        string name
        int order
    }

    PLACE_KEYWORD {
        int place_id FK
        int keyword_id FK
        int count
    }

    AWARD_RES {
        int award_category_id FK
        int place_id FK
        int count "vote count"
        int rank "final rank"
    }

    AWARD_CATEGORY {
        int id PK
        int award_id FK
        string name
    }

    AWARD {
        int award_id PK
        string name
        date date
    }

    EMBLEM {
        int emblem_id PK
        string name
        string icon_url
        int tier_order
        int review_threshold
        string type
    }

    USER_EMBLEM {
        int userid FK
        int emblemid FK
    }

    PLACE_BOOKMARK {
        int userid FK
        int place_id FK
    }
```

## Core Features

### Authentication
Sogang University email verification is the primary login method; social login is also supported. Protected actions (writing reviews, bookmarking) must show a login-prompt modal when accessed unauthenticated.

### Map & List
Display restaurant locations on a Kakao map. List sorting options: distance (PostGIS), ribbon tier, and alphabetical.

### Review & Keyword System
Reviews consist of text, photos, and up to 3 keywords selected from 8 fixed options:
밥약하기 좋아요 / 맛이 있어요 / 가성비 좋아요 / 분위기 좋아요 / 친절해요 / 혼자 먹기 좋아요 / 모임장소로 좋아요 / 데이트하기 좋아요

Keywords with higher selection counts must be visually emphasized (size or color). A review guideline/disclaimer must be shown on the review form.

### Gamification
Users receive tier emblems based on `review_cnt`. When a review is submitted, update `review_cnt` and check emblem thresholds.
