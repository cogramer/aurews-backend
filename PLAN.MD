Fullstack Newspaper App — Build Plan
Stack: Next.js 14 (App Router) · PostgreSQL · Prisma · Redis · S3 · Quartz-style UI


Table of Contents
Architecture Overview
User Roles
Project Structure
Phase 1 — Database & Schema
Phase 2 — Backend API
Phase 3 — Auth System
Phase 4 — Media & Storage
Phase 5 — Search
Phase 6 — Frontend (Quartz UI)
Phase 7 — Performance & Caching
Phase 8 — DevOps & Deployment
Timeline


1. Architecture Overview
┌──────────────────────────────────────────────┐
│               Vercel / Railway               │
│                                              │
│         ┌─────────────────────┐              │
│         │    Next.js App      │              │
│         │    (App Router)     │              │
│         └──────────┬──────────┘              │
│                    │                         │
│         ┌──────────▼──────────┐              │
│         │   API Route Layer   │              │
│         │     /api/v1/*       │              │
│         └──────────┬──────────┘              │
│                    │                         │
│     ┌──────────────┼──────────────┐          │
│     │              │              │          │
│  ┌──▼──┐      ┌────▼───┐    ┌────▼───┐       │
│  │ PG  │      │ Redis  │    │  S3    │       │
│  │  +  │      │ Cache  │    │ Media  │       │
│  │Prsma│      │        │    │ Store  │       │ 
│  └─────┘      └────────┘    └────────┘       │
└──────────────────────────────────────────────┘

Core decisions:

Next.js App Router for both frontend and backend — one repo, no context switching
PostgreSQL + Prisma as the source of truth — structured content, clean migrations, type safety
Redis for caching hot posts and rate limiting login attempts
S3-compatible storage (AWS S3 or Cloudflare R2) for images — never store media in the DB
Meilisearch (self-hosted via Docker) for full-text post search
No external CMS — authenticated users write directly through the app's own editor


2. User Roles
The app uses a strict two-role system: `USER` and `ADMIN`.

**USER**
Any registered and logged-in user.
Can:
- Browse all published posts
- Filter posts by category or author
- Register and login
- Write and publish new posts
- Edit their own posts
- Delete their own posts

Cannot:
- Edit or delete another user's posts
- Change system-level settings

**ADMIN**
Admin users have elevated privileges.
Can do everything a `USER` can, plus:
- Edit ANY post, regardless of author
- Delete ANY post, regardless of author

Permissions at a Glance
| Action | Guest | USER | ADMIN |
|---|---|---|---|
| Read published posts | ✓ | ✓ | ✓ |
| Register / log in | ✓ | ✓ | ✓ |
| Post new post | ✗ | ✓ | ✓ |
| Edit post | ✗ | ✓ (own only) | ✓ (any) |
| Delete post | ✗ | ✓ (own only) | ✓ (any) |


3. Project Structure
newspaper/
├── app/
│   ├── (site)/                       # Public-facing site
│   │   ├── page.tsx                  # Homepage
│   │   ├── [slug]/page.tsx           # post reading page
│   │   ├── topic/[slug]/page.tsx     # Topic landing page
│   │   ├── author/[slug]/page.tsx    # Author profile page
│   │   └── search/page.tsx           # Search results
│   │
│   ├── (auth)/                       # Auth pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify/page.tsx           # Email verification
│   │
│   ├── (dashboard)/                  # Authenticated user area
│   │   ├── dashboard/page.tsx        # My posts overview
│   │   ├── posts/
│   │   │   ├── new/page.tsx          # Write new post
│   │   │   └── [id]/edit/page.tsx    # Edit existing post
│   │   └── profile/page.tsx          # Edit own profile
│   │
│   └── api/
│       └── v1/
│           ├── posts/             # CRUD endpoints
│           ├── topics/               # Read-only topic endpoints
│           ├── authors/              # Author profile endpoints
│           ├── media/                # Image upload endpoint
│           ├── search/               # Search proxy
│           └── auth/
│               ├── register/
│               ├── login/
│               ├── logout/
│               └── verify/
│
├── lib/
│   ├── db/                           # Prisma client + query helpers
│   ├── redis/                        # Cache client + helpers
│   ├── storage/                      # S3 upload/delete helpers
│   ├── search/                       # Meilisearch client
│   └── auth/                         # JWT helpers, session utilities
│
├── components/
│   ├── editorial/                    # Public site UI components
│   └── dashboard/                   # Dashboard UI components
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
└── middleware.ts                      # Route protection


4. Phase 1 — Database & Schema
Start here. Get this right before writing any API or UI code.
4.1 Core Tables
Users Stores login credentials and role assignment. Role defaults to CONTRIBUTOR for all registered users. ADMIN exists in the enum but is not used in this phase.
Fields: id, email, passwordHash, role, emailVerified, createdAt, updatedAt
Profiles One-to-one with Users. Holds the public-facing author information shown on post bylines and author pages.
Fields: id, userId, slug, displayName, bio, avatarUrl, twitterHandle, createdAt
posts The central content table. Body is stored as structured JSON (Tiptap/ProseMirror format) rather than raw HTML — this makes it renderer-agnostic and avoids injection risks. A separate bodyText plain-text field is maintained for search indexing.
Fields: id, slug, title, deck (subtitle/standfirst), body (JSON), bodyText, status, featuredImage, readingTime, authorId, publishedAt, createdAt, updatedAt
Topics Curated content categories managed at the application level. Not user-created. Each topic has a color for the pill badges in the Quartz-style UI.
Fields: id, slug, name, description, color
postTopics Join table linking posts to one or more topics.
Fields: postId, topicId

Tags Freeform labels that authenticated users can attach to their own posts. Unlike topics, tags are not curated.

Fields: id, slug, name

postTags Join table linking posts to tags.

Fields: postId, tagId

Media A record for every uploaded file. Stores the S3 object key, public URL, dimensions, and who uploaded it. Media is never deleted from S3 without removing the DB record first.

Fields: id, key, url, mimeType, size, alt, width, height, uploadedBy, createdAt

Sessions Server-side session records used to invalidate tokens on logout without waiting for JWT expiry.

Fields: id, userId, token, expiresAt
4.2 post Status Flow
DRAFT ──────► PUBLISHED

  ▲               │

  │               ▼

  └────────── ARCHIVED

DRAFT — saved but not visible to the public; only the author can see it
PUBLISHED — live and publicly visible; author can still edit it
ARCHIVED — hidden from public listings; author can restore to draft

There is no review queue in this phase — authenticated users publish directly.
4.3 Schema Design Decisions
deck as a first-class field — Quartz's distinctive standfirst text lives in its own column, not inside the body JSON. This makes it available in list queries without parsing the full body.
body as JSON, not HTML — stores Tiptap's document format. Re-render with any library, apply style changes without data migrations, and parse programmatically.
bodyText as a derived field — stripped plain text, updated every time the post is saved. Used for Meilisearch indexing and estimated reading time calculation.
readingTime computed on save — stored as an integer (minutes) so it does not have to be recalculated on every page render.
role enum includes ADMIN — even though admin is not built yet, defining it in the schema now means no migration is needed later.


5. Phase 2 — Backend API
Build these endpoints in order. Each one depends on the previous phase being complete.
5.1 Endpoint Map
posts

Method | Route | Who can call | Description
--- | --- | --- | ---
GET | [x] `/api/posts` | Anyone | Paginated list of published posts; supports filters for category
GET | [x] `/api/posts/[slug]` | Anyone | Single post by slug
POST | [x] `/api/posts` | USER / ADMIN | Create a new post; requires auth
PUT | [x] `/api/posts/[slug]` | Owner or ADMIN | Update title, content, thumbnail, or category
DELETE | [x] `/api/posts/[slug]` | Owner or ADMIN | Delete a post permanently


Categories

Method | Route | Who can call | Description
--- | --- | --- | ---
GET | [ ] `/api/categories` | Anyone | All categories
GET | [ ] `/api/categories/[slug]` | Anyone | Category detail and its published posts


Authors

Method | Route | Who can call | Description
--- | --- | --- | ---
GET | [ ] `/api/authors/[slug]` | Anyone | Author profile and their published posts
PATCH | [ ] `/api/authors/[slug]` | Authenticated (own only) | Update bio, avatar, social links


Media

Method | Route | Who can call | Description
--- | --- | --- | ---
POST | [ ] `/api/media` | Authenticated | Upload an image; processes through Sharp, stores in S3, returns URL
DELETE | [ ] `/api/media/[id]` | Authenticated (own only) | Remove from S3 and delete the DB record


Search

Method | Route | Who can call | Description
--- | --- | --- | ---
GET | [ ] `/api/search?q=` | Anyone | Full-text search with optional topic filter; results include highlighted excerpts


Auth

Method | Route | Who can call | Description
--- | --- | --- | ---
POST | [x] `/api/auth/register` | Anyone | Create account
POST | [ ] `/api/auth/verify` | Anyone | Confirm email address with token
POST | [x] `/api/auth/login` | Anyone | Validate credentials; issue JWT in HTTP-only cookie
POST | [ ] `/api/auth/logout` | Authenticated | Invalidate session token; clear cookie

5.2 Shared API Conventions
All list endpoints are paginated with page and limit query params; responses include a meta object with total, pages, and page
Ownership checks happen in the API handler before any DB write — never rely on the frontend to enforce this
View count increments are fire-and-forget: they run asynchronously and do not block the response
Slug generation is automatic on post creation, derived from the title, with a uniqueness check and numeric suffix if needed
All timestamps are returned in ISO 8601 UTC format
5.3 Error Response Shape
Every error returns a consistent JSON body so the frontend never needs to guess the format.

{

  "error": {

    "code": "UNAUTHORIZED",

    "message": "You must be logged in to perform this action"

  }

}

Standard HTTP status codes apply: 400 for validation errors, 401 for missing auth, 403 for forbidden (authenticated but not the owner), 404 for not found, 422 for unprocessable entity, 429 for rate limit exceeded.


6. Phase 3 — Auth System
6.1 Strategy
Use JWT stored in an HTTP-only cookie, verified with jose. No third-party auth library — the app's auth surface is small and a custom implementation keeps the dependency count low.

No OAuth in this phase. Email and password only. Email verification is required before an account becomes active.
6.2 Registration Flow
User submits email and password
API validates inputs (email format, password minimum length of 8 characters)
Password is hashed with bcrypt (cost factor 12)
User record is created with emailVerified: false
A short-lived signed verification token is generated and emailed to the user
User clicks the link → /api/v1/auth/verify → sets emailVerified: true
User can now log in
6.3 Login Flow
User submits email and password
Rate limit check: maximum 5 failed attempts per IP per 15 minutes (tracked in Redis)
Look up user by email; if not found, return a generic error (do not confirm whether the email exists)
Compare submitted password against stored hash
If valid, create a Session record in the DB and issue a signed JWT (7-day expiry)
JWT is set as an HTTP-only, SameSite=Strict cookie
6.4 Request Authentication
Every protected API route reads the session cookie, verifies the JWT, and checks that a corresponding Session record still exists in the DB (to support forced logout). If any step fails, return 401.
6.5 Middleware — Route Protection
Next.js middleware intercepts all /dashboard/* routes. If no valid session cookie is present, the user is redirected to /login. All other routes are public.
6.6 Security Practices
Passwords hashed with bcrypt; never stored in plain text or logged
JWT secret is a minimum 32-character random string stored as an environment variable
Session cookie flags: HttpOnly, Secure (production), SameSite=Strict
Logout deletes the Session record so the JWT cannot be replayed even before expiry
Rate limiting on login via Redis to prevent brute-force attacks
Email enumeration protection — login and registration always return the same generic error message for invalid credentials


7. Phase 4 — Media & Storage
7.1 Upload Flow
Browser → POST /api/v1/media → Sharp processing → S3 upload → DB record → URL returned

Images are never stored on the server filesystem or in the database. All media goes through S3 (or Cloudflare R2 for zero egress fees).
7.2 Image Processing Pipeline
Before writing to S3, every uploaded image goes through Sharp on the server:

Validate that the file is an accepted image type (JPEG, PNG, WebP, GIF)
Reject files over 10MB
Resize to a maximum of 2000px on the longest edge, preserving aspect ratio; never upscale
Convert to WebP at 85% quality
Generate a 800px-wide thumbnail variant at 80% quality for post card use
Both variants are uploaded to S3 under a namespaced key (e.g., media/{userId}/{nanoid}/full.webp)
7.3 Storage Layout
S3 bucket: newspaper-media/

├── media/

│   └── {userId}/

│       └── {nanoid}/

│           ├── full.webp       (max 2000px)

│           └── thumb.webp      (max 800px)
7.4 Media Deletion
When an post is deleted (archived) or an image is removed from an post, the media record is deleted from the DB and the S3 object is removed. No orphaned files accumulate in the bucket.


8. Phase 5 — Search
8.1 Engine Choice
Meilisearch, self-hosted via Docker on Railway. Chosen over Elasticsearch for its simpler configuration, faster setup, and purpose-fit editorial search features (typo tolerance, highlighting, cropping).
8.2 What Gets Indexed
Each post document in the search index contains: id, slug, title, deck, bodyText (truncated to 5000 chars), authorName, authorSlug, topicNames, topicSlugs, publishedAt.

Only posts with status PUBLISHED are indexed.
8.3 Index Behavior
Searchable fields (in priority order): title, deck, bodyText, authorName, topicNames
Filterable fields: topicSlugs, authorSlug, publishedAt
Typo tolerance: enabled — one typo allowed for words up to 8 characters
Results include highlighted excerpts from bodyText showing where the query matched
Results are filterable by topic using the topic query parameter on the search API
8.4 Sync Strategy
On publish: post is indexed immediately after the DB write succeeds, asynchronously (non-blocking)
On update: existing document is replaced in the index
On archive/delete: document is removed from the index
A nightly full re-sync job re-indexes all published posts to catch any drift


9. Phase 6 — Frontend (Quartz UI)
9.1 Quartz Visual Language
The Quartz / qz.com aesthetic is defined by:

Near-black and white as the dominant palette; color appears only in topic pills and link hover states
Large, confident serif headlines (Playfair Display or Tiempos) contrasted with a clean sans body (Inter or equivalent)
Minimal chrome — no sidebars cluttered with widgets, no visible UI scaffolding
Full-bleed hero image on the homepage with a gradient text overlay
Compact post card rows below the hero — headline and deck only, no thumbnail
Byline rendered as a single subtle line: author name · date · reading time
Topic pills as small, colored rounded badges that appear before the headline
9.2 Rendering Strategy
Page
Strategy
Why
Homepage
ISR, revalidate every 60s
Changes often but doesn't need to be live
post page
ISR, revalidate every 300s
Rarely changes after publish
Topic page
ISR, revalidate every 120s
New posts appear without a full rebuild
Author page
ISR, revalidate every 300s
Profile changes are infrequent
Search page
Dynamic (no cache)
Query-dependent, cannot be pre-rendered
Dashboard pages
Dynamic (auth-gated)
Per-user content, must never be cached at edge

9.3 Public Pages
Homepage

Full-bleed hero post (featured image, title, deck, byline, topic pills)
Below the hero: a two-column grid of compact post cards
Right sidebar: topic list with post counts, trending topics
No pagination on homepage — infinite scroll or "load more" button for older posts

post Page

Single-column reading layout, maximum 720px wide, centered
Header: topic pills → large serif headline → deck → byline → featured image
Body text at 18px, 1.8 line height for comfortable long-form reading
Blockquotes styled with a thick left border, no quote marks
Figures are edge-to-edge (wider than the text column)
Footer: author card with bio and link to their profile page
Below: related posts pulled from the same topics

Topic Page

Topic name and description at the top with the topic color as an accent
Chronological list of published posts in that topic
Paginated at 20 posts per page

Author Page

Author avatar, display name, bio, and social links
Chronological list of their published posts

Search Results

Live search input (debounced, 300ms) at the top
Results show highlighted title and excerpt where the query matched
Filterable by topic using pills below the search bar
9.4 Authenticated User Pages
Dashboard — My posts

Table listing all of the user's posts (DRAFT, PUBLISHED, ARCHIVED) with title, status badge, publish date, and action links
Quick links to write a new post or edit an existing one

Write / Edit post

Tiptap rich text editor for the body
Sidebar fields: title, deck, topic selector (multi-select from curated list), tag input, featured image upload
Auto-save to DRAFT every 30 seconds while the editor is open
Publish button sets status to PUBLISHED immediately
Save as draft button keeps it private

Profile Settings

Edit display name, bio, avatar, and Twitter/social handle
Avatar upload goes through the same media pipeline as post images
9.5 Typography
Headlines: Playfair Display 700/800, rendered at 40–60px on desktop depending on context
Deck / standfirst: Inter, 20–22px, color #555, normal weight
Body text: Inter (or system sans), 18px, line height 1.8, color #1a1a1a
Byline: Inter, 13px, color #888, all on one line
Topic pills: Inter, 11px uppercase or small caps, background uses the topic's color at 15% opacity, text uses the topic's full color
9.6 Component List
Component
Used on
Heropost
Homepage
postCard
Homepage grid, topic page, author page, search
Byline
Every post card and post page
TopicPills
Every post card and post page
postBody
post page
AuthorCard
post page footer
Relatedposts
post page
TopicsList
Homepage sidebar
SearchBar
Nav and search page
postEditor
Write and edit pages
ImageUpload
post editor and profile settings
StatusBadge
Dashboard post table
DashboardTable
Dashboard



10. Phase 7 — Performance & Caching
10.1 Caching Layers
Browser Cache (CDN headers, ~60s for public pages)

    ↓ miss

Vercel Edge Cache (serves ISR pages)

    ↓ miss

Redis (in-memory, ~1ms, for API responses)

    ↓ miss

PostgreSQL
10.2 What Gets Cached in Redis
post list responses (TTL: 60s)
Single post responses (TTL: 300s)
Topic list with counts (TTL: 120s)
Author profile + post list (TTL: 300s)

When an post is published, updated, or archived, all related Redis keys are deleted immediately so the next request gets fresh data.
10.3 Database Indexes
The following indexes need to be added to the migration alongside the schema. Without them, queries degrade quickly as post count grows:

Composite index on (status, publishedAt DESC) — used by every post list query
Index on authorId — used by author profile queries
Index on publishedAt DESC — used for chronological listings
GIN full-text index on (title, bodyText) — fallback search before Meilisearch is ready
10.4 Query Discipline
Every Prisma query uses select to specify exactly the fields needed — no findMany that returns body when only title and slug are needed
List queries for the homepage and topic pages never fetch body or bodyText — those fields are large and only needed on the post reading page
Connection pooling is enabled via PgBouncer (available by default on Railway and Supabase)


11. Phase 8 — DevOps & Deployment
11.1 Required Environment Variables
DATABASE_URL          — PostgreSQL connection string

REDIS_URL             — Redis connection string

JWT_SECRET            — Min 32-character random string for signing tokens

AWS_ACCESS_KEY_ID     — S3 credentials

AWS_SECRET_ACCESS_KEY

AWS_REGION

S3_BUCKET

MEILISEARCH_HOST      — e.g. https://search.yourdomain.com

MEILISEARCH_API_KEY

SMTP_HOST             — For verification emails

SMTP_PORT

SMTP_USER

SMTP_PASS
11.2 Recommended Services
Layer
Provider
Notes
Next.js App
Vercel
ISR, edge caching, and Cron built in
PostgreSQL
Railway or Supabase
Enable PgBouncer for connection pooling
Redis
Upstash
Serverless Redis, generous free tier
Media Storage
Cloudflare R2
S3-compatible, zero egress fees
Search
Railway (Docker)
Run Meilisearch as a Docker service
Email
Resend or Postmark
Transactional only, for verification emails

11.3 CI/CD Pipeline
The recommended pipeline runs on every push to main via GitHub Actions:

Type check — tsc --noEmit
Lint — ESLint
Run tests — unit tests for API handlers and utilities
Run DB migrations — prisma migrate deploy against the production DB
Deploy to Vercel — triggered automatically after migration succeeds

Never run migrations and deployment in parallel. Migrations run first, deployment follows.
11.4 Branching Strategy
main — production; auto-deploys to Vercel on merge
develop — staging environment; merged into main via PR only
Feature branches — named feat/description, opened as PRs against develop


12. Timeline
Week
Focus
Deliverable
1
Prisma schema, migrations, seed data
Working database with sample posts and users
2
Core post API (list, single, create, update, delete)
Fully working read/write API
3
Auth API (register, verify, login, logout, middleware)
Secure login flow end-to-end
4
Media upload pipeline (S3, Sharp, DB record)
Image upload working in isolation
5
Meilisearch setup and search API
Search endpoint returning results with highlights
6
Homepage and post reading page (ISR)
Public site is readable and navigable
7
Topic pages, author pages, search results page
Full public site navigation
8
Dashboard, post editor (Tiptap), auto-save
Authenticated users can write and publish
9
Profile settings, image upload in editor, delete/archive
Full contributor workflow complete
10
Redis caching, DB indexes, query optimization
API responses under 100ms at p95
11
CI/CD pipeline, staging environment, production deploy
Live on Vercel
12
QA, accessibility audit, Lighthouse, buffer
Production-ready



Key Principles
Get the schema right before writing any API code. The data model is the hardest thing to change later. Spend the first week entirely in Prisma.

Ownership checks live in the API, not the frontend. Every PATCH and DELETE handler verifies that the authenticated user owns the resource before touching the database. The frontend can hide buttons, but the API enforces the rule.

No review queue yet — ship trust. Authenticated users publish directly. A bad-actor problem is a later problem; premature moderation tooling slows down the legitimate majority.

ISR is the right default for a news site. 90% of pages should never hit the database on a user request. Publish the post once; serve it from the edge forever.

Build the data model to support Admin now, but don't build the Admin features. One extra enum value in the schema costs nothing. Retrofitting a role system into a production database is expensive.

