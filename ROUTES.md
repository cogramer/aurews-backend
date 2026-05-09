# AUREWS — Route Reference
> Last updated: 2026-05-09 | Branch: feature/frontend-dev

## Backend API Routes (`/api/...`)

All API routes live under `/api/`. JSON in, JSON out. Protected routes require `Authorization: Bearer <token>` header.

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create a new user account. Body: `{ email, password, name }` |
| `POST` | `/api/auth/login` | No | Login. Body: `{ email, password }`. Returns `{ token, user }` |
| `GET` | `/api/me` | ✅ Yes | Get the currently logged-in user profile |

### Posts
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/posts` | No | Fetch published posts. Query: `?category=slug`, `?page=1`, `?limit=10`. Returns `{ data, meta: { total, page, limit, hasMore } }` |
| `POST` | `/api/posts` | ✅ Yes (any user) | Create a new post. Body: `{ title, slug, content, metaDescription, thumbnail, categoryId, status }` |
| `GET` | `/api/posts/[slug]` | No | Fetch a single post by slug. Returns full post with category + author |
| `PUT` | `/api/posts/[slug]` | ✅ Yes (Owner/Admin) | Update a post by slug |
| `DELETE` | `/api/posts/[slug]` | ✅ Yes (Owner/Admin) | Delete a post + its Cloudinary image by slug |

### Media
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/media` | ✅ Yes | Upload image to Cloudinary. Form body: `file` (WebP or AVIF only). Returns `{ url, publicId }` |

### Search
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/search` | No | Full-text search via Meilisearch. Query: `?q=query`, `?limit=10`, `?category=CategoryName` (name, not slug) |

### Sync
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/sync` | ✅ Yes (Admin) | Sync all published posts to Meilisearch index |

---

## Frontend Page Routes

All frontend routes are Next.js App Router pages (server-rendered by default).

| Route | File | SEO | Description |
|---|---|---|---|
| `/` | `app/page.tsx` | ✅ | Homepage — Hero + 3-col grid + Latest + A.I. block + Most Popular |
| `/[slug]` | `app/[slug]/page.tsx` | ✅ `generateMetadata` | Individual article page |
| `/category/[slug]` | `app/category/[slug]/page.tsx` | ✅ `generateMetadata` | Category listing with Load More (client-side pagination) |
| `/search` | `app/search/page.tsx` | ✅ | Search page — Meilisearch full-text, with optional category filter |
| `/login` | `app/login/page.tsx` | — | Login page (JWT → localStorage) |
| `/write/create` | `app/write/create/page.tsx` | — | Authenticated create post form (auth guard + Two-Step Upload) |
| `/sitemap.xml` | `app/sitemap.ts` | ✅ | Auto-generated sitemap with all posts + category URLs |
| `/robots.txt` | `app/robots.ts` | ✅ | Crawler rules — blocks `/api/`, `/write/`, `/login` |
| `/` (invalid routes) | `app/not-found.tsx` | — | Custom 404 page |

---

## Components

| Component | Type | Description |
|---|---|---|
| `Navbar.tsx` | Server | Top utility bar + logo + category nav |
| `MobileMenu.tsx` | Client | Hamburger toggle + slide-in drawer (used inside Navbar) |
| `Footer.tsx` | Server | Inverted dark footer with newsletter form + category links |
| `CreatePostForm.tsx` | Client | Two-step upload form (auth guard + Cloudinary + post creation) |
| `PostGrid.tsx` | Client | Reusable post grid with Load More button (used in category pages) |

---

## SEO Checklist

- [x] `generateMetadata()` on article pages (`/[slug]`)
- [x] `generateMetadata()` on category pages (`/category/[slug]`)
- [x] Root `metadata` with `title.template` in `layout.tsx`
- [x] `metadataBase` using `NEXT_PUBLIC_BASE_URL` env var
- [x] OpenGraph + Twitter card tags on articles
- [x] `/sitemap.xml` auto-generated from DB
- [x] `/robots.txt` blocking private routes
- [x] `sizes` prop on all `fill` images
- [x] `loading="lazy"` on below-fold images, `priority` on hero
- [x] Custom 404 page (`app/not-found.tsx`)
- [ ] `og:image` default fallback image for pages without thumbnails
- [ ] Schema.org `Article` JSON-LD on article pages (future)
