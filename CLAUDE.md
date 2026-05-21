# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sogang Ribbon (서강리본)** is a restaurant discovery service for restaurants near Sogang University.

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

## Core Features

### DB SQL
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.award (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date_start timestamp with time zone,
  CONSTRAINT award_pkey PRIMARY KEY (id)
);
CREATE TABLE public.award_category (
  award_id uuid NOT NULL,
  name text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT award_category_pkey PRIMARY KEY (id),
  CONSTRAINT award_category_award_id_fkey FOREIGN KEY (award_id) REFERENCES public.award(id)
);
CREATE TABLE public.award_res (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  award_category_id uuid NOT NULL,
  place_id uuid NOT NULL,
  rank smallint,
  description text,
  CONSTRAINT award_res_pkey PRIMARY KEY (id),
  CONSTRAINT award_res_award_category_id_fkey FOREIGN KEY (award_category_id) REFERENCES public.award_category(id),
  CONSTRAINT award_res_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.place(id)
);
CREATE TABLE public.place (
  id uuid NOT NULL,
  name text NOT NULL,
  address text,
  classification text,
  latitude double precision,
  longitude double precision,
  img_url text,
  ribbon_cardinal smallint,
  ribbon_deepred smallint,
  ribbon_pink smallint,
  desc_thumbnail text,
  desc_detail text,
  ribbon_type smallint DEFAULT '0'::smallint,
  CONSTRAINT place_pkey PRIMARY KEY (id)
);
CREATE TABLE public.place_bookmark (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  place_id uuid NOT NULL,
  CONSTRAINT place_bookmark_pkey PRIMARY KEY (id),
  CONSTRAINT place_bookmark_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.place(id),
  CONSTRAINT place_bookmark_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.user (
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user'::text,
  nickname text,
  password text,
  profile_url text,
  CONSTRAINT user_pkey PRIMARY KEY (id)
);

### Authentication
Every email & password

### Map & List
Display restaurant locations on a Kakao map. List sorting options: distance (PostGIS), ribbon tier, and alphabetical.

