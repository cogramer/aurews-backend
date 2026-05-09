# AUREWS — Route Reference

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
| `GET` | `/api/posts` | No | Fetch published posts. Query params: `?category=slug`, `?page=1`, `?limit=10` |
| `POST` | `/api/posts` | ✅ Yes | Create a new post. Body: `{ title, slug, content, metaDescription, thumbnail, categoryId, status }` |
| `GET` | `/api/posts/[slug]` | No | Fetch a single post by slug |
| `PUT` | `/api/posts/[slug]` | ✅ Yes (Owner/Admin) | Update a post by slug |
| `DELETE` | `/api/posts/[slug]` | ✅ Yes (Owner/Admin) | Delete a post + its Cloudinary image by slug |

### Media
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/media` | ✅ Yes | Upload an image to Cloudinary. Form body: `file` (WebP or AVIF only). Returns `{ url, publicId }` |

### Search
| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/search` | No | Full-text search via Meilisearch. Query params: `?q=query`, `?limit=10`, `?category=name` |

### Sync
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/sync` | ✅ Yes (Admin) | Sync all published posts to Meilisearch index |

---

## Frontend Page Routes

All frontend routes are Next.js App Router pages. They are server-rendered by default.

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Homepage — Hero + 3-column grid of latest posts |
| `/[slug]` | `app/[slug]/page.tsx` | ⚠️ **TODO** — Individual article page (must be moved from `app/posts/[slug]`) |
| `/login` | `app/login/page.tsx` | Login page |
| `/category/[slug]` | ⚠️ **TODO** | Category listing page (not yet created) |
| `/search` | ⚠️ **TODO** | Search results page (not yet created) |
| `/admin/post/create` | `app/admin/post/create/page.tsx` | Admin — Create new post form |

---

## Pending Work / Known Issues

1. **Article page URL** — Currently at `app/posts/[slug]/page.tsx` (URL: `/posts/my-slug`). Must move to `app/[slug]/page.tsx` (URL: `/my-slug`) to match Quartz-style clean URLs. Manual step required: rename folder in VS Code Explorer.
2. **Admin folder** — Currently at `app/admin/post/create`. Should be `app/admin/posts/create` (plural) for consistency with API. Rename in VS Code Explorer.
3. **Category page** — `/category/[slug]` page does not exist yet. Backend query supports it via `?category=slug`.
4. **Search page** — `/search` UI page does not exist yet. Backend Meilisearch route is ready.
5. **Footer** — No footer component exists yet.
6. **SEO metadata** — `generateMetadata()` not implemented on article pages (`/[slug]`). Critical for SEO.
