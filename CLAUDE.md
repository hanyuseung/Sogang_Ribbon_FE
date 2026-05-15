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
  count bigint NOT NULL DEFAULT '0'::bigint,
  rank smallint,
  CONSTRAINT award_res_pkey PRIMARY KEY (id),
  CONSTRAINT award_res_award_category_id_fkey FOREIGN KEY (award_category_id) REFERENCES public.award_category(id),
  CONSTRAINT award_res_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.place(id)
);
CREATE TABLE public.emblem (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  icon_url text,
  tier_order smallint,
  review_threshold bigint,
  type text,
  CONSTRAINT emblem_pkey PRIMARY KEY (id)
);
CREATE TABLE public.keyword (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  order smallint,
  CONSTRAINT keyword_pkey PRIMARY KEY (id)
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
  CONSTRAINT place_pkey PRIMARY KEY (id)
);
CREATE TABLE public.place_keyword (
  place_id uuid NOT NULL,
  keyword_id uuid NOT NULL,
  count bigint NOT NULL DEFAULT '0'::bigint,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT place_keyword_pkey PRIMARY KEY (id),
  CONSTRAINT place_keyword_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.place(id),
  CONSTRAINT place_keyword_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES public.keyword(id)
);
CREATE TABLE public.review (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  content text,
  rating smallint NOT NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  place_id uuid,
  user_id uuid NOT NULL,
  keywords_id ARRAY,
  CONSTRAINT review_pkey PRIMARY KEY (id),
  CONSTRAINT review_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.place(id),
  CONSTRAINT review_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.review_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  img_url text,
  sort_order smallint,
  review_id uuid NOT NULL,
  CONSTRAINT review_images_pkey PRIMARY KEY (id),
  CONSTRAINT review_images_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.review(id)
);
CREATE TABLE public.review_keyword (
  review_id uuid NOT NULL,
  keyword_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT review_keyword_pkey PRIMARY KEY (id),
  CONSTRAINT review_keyword_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.review(id),
  CONSTRAINT review_keyword_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES public.keyword(id)
);
CREATE TABLE public.user (
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'user'::text,
  nickname text,
  password text,
  profile_url text,
  review_cnt bigint NOT NULL DEFAULT '0'::bigint,
  CONSTRAINT user_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_emblem (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  emblem_id uuid NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT user_emblem_pkey PRIMARY KEY (id),
  CONSTRAINT user_emblem_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT user_emblem_emblem_id_fkey FOREIGN KEY (emblem_id) REFERENCES public.emblem(id)
);

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
