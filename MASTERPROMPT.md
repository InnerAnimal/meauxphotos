# MEAUXPHOTOS - COMPLETE BUILD MASTERPROMPT

## PROJECT OVERVIEW
Build a Next.js 14 production-ready image optimization and social media management platform for Meauxbility brands (Meauxbility, Inner Animals, iAutodidact). The app enables team collaboration for content upload, optimization, storage in Cloudflare R2, and multi-platform social media posting.

## TECH STACK
- Next.js 14.2+ (App Router, TypeScript, Server Actions)
- Tailwind CSS + shadcn/ui components
- Cloudflare R2 (S3-compatible storage via @aws-sdk/client-s3)
- Supabase (authentication + database for assets/posts/teams)
- Sharp (server-side image optimization)
- Social Media APIs: Meta Graph API (Instagram/Facebook), TikTok, LinkedIn, YouTube, Snapchat
- Vercel deployment (project ID: prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj)

## DESIGN SYSTEM
**Brand Colors:**
- Primary: #1F97A9 (teal) / #186F7D (dark) / #26B4C9 (light)
- Meauxbility: #FF6B00 (orange) / #339999 (teal)
- Inner Animals: Purple accent (#8B5CF6)
- Glass-morphism cards: bg-white/80 backdrop-blur-sm
- Gradients: linear-gradient(135deg, from-primary to-primary-light)

**Typography:** Inter font family, bold headings, clean sans-serif

**Layout:** Fixed sidebar (280px), main content area with responsive grid, glass cards with hover effects

## AUTHENTICATION & USER MANAGEMENT
Use Supabase Auth with the following structure:

**Tables:**
1. `users` (id, email, full_name, role, avatar_url, created_at)
2. `team_members` (id, user_id, brand_id, role, permissions)
3. `brands` (id, name, slug, primary_color, logo_url)
4. `social_accounts` (id, user_id, brand_id, platform, access_token, refresh_token, expires_at, username)
5. `assets` (id, brand_id, user_id, filename, r2_path, cdn_url, file_type, file_size, dimensions, tags[], uploaded_at)
6. `scheduled_posts` (id, brand_id, user_id, content, platforms[], assets[], scheduled_for, status, posted_at)

**Auth Flow:**
- Email/password signup with team invitation links
- Role-based access: Owner, Admin, Editor, Viewer
- Social OAuth connections stored per user/brand

## CLOUDFLARE R2 INTEGRATION
**Configuration (from GitHub Secrets → Vercel Env Vars):**
```
R2_ACCESS_KEY_ID=914b9e2c6f3310295d94a46df9180156
R2_SECRET_ACCESS_KEY=a3dfb3efe4b66f734953f9ec35aa0611cd047e655d380a4cfeabc23befb75b90
R2_ENDPOINT=https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com
R2_BUCKET_NAME=meauxaccess-bucket
R2_ACCOUNT_ID=ede6590ac0d2fb7daf155b35653457b2
```

**File Structure in R2:**
```
/meauxbility/images/YYYY/MM/filename.webp
/meauxbility/videos/YYYY/MM/filename.mp4
/inneranimals/images/YYYY/MM/filename.webp
/iautodidact/images/YYYY/MM/filename.webp
```

**Upload Pipeline:**
1. Client uploads via drag/drop or file picker
2. Server Action receives file → Sharp optimization (resize max 1920px, convert to WebP 85% quality, strip EXIF)
3. Upload to R2 with PutObjectCommand
4. Generate public CDN URL (custom domain or R2.dev subdomain)
5. Save metadata to Supabase `assets` table
6. Return CDN URL + metadata to client

## CORE FEATURES

### 1. DASHBOARD (Landing Page)
- Overview stats: Total assets, storage used, posts scheduled, team members
- Quick actions: Upload, Schedule Post, Browse Library
- Recent activity feed
- Brand switcher (All/Meauxbility/Inner Animals/iAutodidact)

### 2. UPLOAD MODULE
- Drag-and-drop zone (supports multi-file: images, videos, PDFs, SVGs)
- Real-time upload progress with percentage
- Automatic optimization preview (before/after file size)
- Brand selector dropdown
- Bulk tagging interface
- Auto-generate alt text using AI (optional: OpenAI Vision API)

### 3. ASSET LIBRARY
- Infinite scroll grid with lazy loading
- Filters: Brand, Type (image/video/document), Date range, Tags
- Search: Filename, tags, AI-generated descriptions
- Bulk actions: Download, Delete, Tag, Move to brand
- Asset preview modal with metadata (size, dimensions, upload date, CDN URL)
- Copy-to-clipboard CDN URL button
- Download optimized version

### 4. SOCIAL MEDIA SCHEDULER
**Post Composer:**
- Rich text editor for caption (character counters per platform)
- Asset selector (multi-image carousels, video preview)
- Platform toggles: Instagram, Facebook, TikTok, LinkedIn, YouTube, Snapchat
- Hashtag suggestions based on brand/content
- Schedule picker (date/time with timezone support)
- Preview for each platform's layout
- Save as draft or schedule immediately

**Calendar View:**
- Monthly/weekly view with scheduled posts
- Drag-to-reschedule
- Color-coded by brand and platform
- Click to edit/delete scheduled posts

**Platform Integrations:**
- Meta Graph API for Instagram/Facebook (requires Business accounts)
- TikTok Content Posting API
- LinkedIn API v2
- YouTube Data API v3
- Snapchat Marketing API
- OAuth flow for each platform (store tokens in `social_accounts` table)
- Auto-refresh expired tokens using refresh_token

### 5. ANALYTICS
- Post performance: Likes, comments, shares, reach per platform
- Top-performing assets by engagement
- Storage usage breakdown by brand
- Upload trends (daily/weekly/monthly)
- Cost tracking: R2 storage costs, API usage

### 6. TEAM MANAGEMENT
- Invite team members by email
- Assign roles and brand access
- Activity log: Who uploaded what, when
- Notification settings (email/in-app for scheduled posts, uploads)

### 7. SETTINGS
- Profile management (name, email, avatar)
- Connected social accounts (connect/disconnect, view permissions)
- Brand settings (logo, colors, default tags)
- Notification preferences
- API keys display (read-only for developers)

## FILE STRUCTURE
```
/app
  /api
    /auth/[...supabase]/route.ts (Supabase auth callback)
    /upload/route.ts (handles file uploads to R2)
    /optimize/route.ts (Sharp image optimization)
    /social
      /connect/[platform]/route.ts (OAuth initiation)
      /callback/[platform]/route.ts (OAuth callback)
      /post/route.ts (publish to platforms)
  /dashboard/page.tsx (overview)
  /upload/page.tsx (drag-drop upload)
  /library/page.tsx (asset grid)
  /schedule/page.tsx (social media composer + calendar)
  /analytics/page.tsx (stats dashboard)
  /team/page.tsx (user management)
  /settings/page.tsx (account/brand settings)
  /login/page.tsx (Supabase auth)
  layout.tsx (root layout with sidebar)
  globals.css (Tailwind + custom styles)

/components
  /ui (shadcn components: button, dialog, dropdown, calendar, etc.)
  /dashboard (Sidebar, Navbar, StatsCard, QuickActions)
  /upload (DragDropZone, UploadProgress, OptimizationPreview)
  /library (AssetGrid, AssetCard, FilterBar, SearchBar)
  /schedule (PostComposer, PlatformToggle, CalendarView, PostPreview)
  /social (SocialConnectButton, PlatformIcon, TokenStatus)

/lib
  /supabase (client.ts, server.ts, middleware.ts)
  /r2 (upload.ts, delete.ts, list.ts)
  /social (instagram.ts, tiktok.ts, linkedin.ts, youtube.ts, snapchat.ts)
  /utils (formatDate, formatFileSize, generateFilename)

/public
  /icons (brand logos, social platform icons)

package.json (all dependencies listed below)
next.config.js (image domains, env vars)
tailwind.config.js (custom colors)
tsconfig.json
.env.example
.gitignore
README.md (setup instructions)
```

## DEPENDENCIES (package.json)
```json
{
  "dependencies": {
    "next": "14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.45.4",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@aws-sdk/client-s3": "^3.654.0",
    "@aws-sdk/lib-storage": "^3.654.0",
    "sharp": "^0.33.5",
    "axios": "^1.7.7",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.446.0",
    "react-dropzone": "^14.2.3",
    "react-calendar": "^5.0.0",
    "recharts": "^2.12.7",
    "zustand": "^5.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.7.5",
    "@types/react": "^18.3.11",
    "typescript": "^5.6.3",
    "tailwindcss": "^3.4.14",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "14.2.15"
  }
}
```

## ENVIRONMENT VARIABLES (GitHub Secrets → Vercel)
```
# Cloudflare R2
R2_ACCESS_KEY_ID=914b9e2c6f3310295d94a46df9180156
R2_SECRET_ACCESS_KEY=a3dfb3efe4b66f734953f9ec35aa0611cd047e655d380a4cfeabc23befb75b90
R2_ENDPOINT=https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com
R2_BUCKET_NAME=meauxaccess-bucket
R2_PUBLIC_URL=https://cdn.meauxbility.org (or R2 public subdomain)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Social Media APIs (obtain from each platform's developer portal)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
SNAPCHAT_CLIENT_ID=your_snapchat_client_id
SNAPCHAT_CLIENT_SECRET=your_snapchat_client_secret

# App Config
NEXT_PUBLIC_APP_URL=https://meauxphotos.vercel.app
NEXTAUTH_SECRET=generate_random_secret_string
```

## VERCEL DEPLOYMENT SETTINGS
**Project ID:** prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj
**Framework:** Next.js
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`
**Root Directory:** `./`
**Node Version:** 20.x

## SOCIAL MEDIA API SETUP NOTES

**Instagram/Facebook (Meta Graph API):**
- Requires Facebook Business account + Instagram Business/Creator account
- Permissions: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`
- OAuth flow: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
- Post endpoint: `POST /{instagram-account-id}/media` → `POST /{instagram-account-id}/media_publish`

**TikTok:**
- TikTok for Developers → Content Posting API
- Permissions: `video.upload`, `video.publish`
- OAuth: https://developers.tiktok.com/doc/content-posting-api-get-started
- Endpoint: `POST /share/video/upload/`

**LinkedIn:**
- LinkedIn Developer Portal → Create App
- Permissions: `w_member_social`, `rw_organization_admin`
- OAuth: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
- Endpoint: `POST /ugcPosts`

**YouTube:**
- Google Cloud Console → Enable YouTube Data API v3
- OAuth scopes: `youtube.upload`, `youtube.readonly`
- Endpoint: `POST /youtube/v3/videos` (resumable upload)

**Snapchat:**
- Snap Publisher API (requires approval)
- OAuth: https://developers.snap.com/api/snap-publisher
- Endpoint: `POST /v1/creatives`

## USER FLOWS

**Team Onboarding:**
1. Admin sends invite link
2. New user signs up with email/password
3. Assigned to brands + role
4. Connect social accounts (OAuth flow for each platform)
5. Upload first asset
6. Schedule first post

**Daily Workflow:**
1. Login → Dashboard shows today's scheduled posts
2. Upload new content (images/videos)
3. Tag and organize in Asset Library
4. Compose post → Select assets → Write caption → Choose platforms → Schedule
5. Review calendar for upcoming posts
6. Monitor analytics for posted content

**Content Posting:**
1. User clicks "Schedule Post"
2. Post Composer opens
3. Select assets from library (drag-and-drop from grid)
4. Write caption (platform-specific character limits shown)
5. Toggle platforms (only connected accounts available)
6. Preview post layout for each platform
7. Set date/time or post immediately
8. Confirm → Post queued
9. Server Action runs at scheduled time → Publishes to all selected platforms
10. Updates post status + saves analytics

## OPTIMIZATION PIPELINE DETAILS
**Image Optimization (Sharp):**
```javascript
await sharp(buffer)
  .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
  .webp({ quality: 85, effort: 6 })
  .toBuffer()
```

**Video Optimization (optional FFmpeg):**
- Resize to 1080p max
- Convert to H.264 codec
- Generate thumbnail at 2s mark

**Supported Formats:**
- Images: JPG, PNG, WebP, SVG, GIF, HEIC
- Videos: MP4, MOV, AVI, WebM
- Documents: PDF

## SECURITY & BEST PRACTICES
- Store OAuth tokens encrypted in Supabase
- Implement CSRF protection for social post actions
- Rate limiting on upload endpoints (10 files/min per user)
- File size limits: Images 50MB, Videos 500MB
- Validate file types server-side (Sharp for images, MIME check)
- Row-level security (RLS) in Supabase for multi-tenancy
- Audit logs for all asset uploads/deletions/posts

## PERFORMANCE OPTIMIZATIONS
- Next.js Image component for all asset thumbnails
- Infinite scroll with intersection observer (load 20 assets at a time)
- CDN caching headers on R2 objects (1 year max-age)
- Debounced search input (300ms)
- Optimistic UI updates for uploads/posts
- Server Actions for mutations (no client-side API calls)

## DESIGN TEAM ONBOARDING GUIDE
**Saving Assets:**
- Use descriptive filenames (hero-meauxbility-2025.jpg)
- Tag all assets with brand + content type (e.g., "meauxbility, hero, website")
- Add alt text for accessibility

**Organization:**
- Brands auto-sorted by folder
- Use date-based uploads for easy chronological browsing
- Tag consistently: "campaign-name", "product-launch", "social-post"

**Optimization:**
- System auto-converts to WebP (no manual work needed)
- Always upload highest quality source files (optimization happens server-side)
- Videos: Upload at max resolution, system handles compression

**Social Posting:**
- Write captions in Post Composer (platform-specific previews)
- Select multiple images for Instagram carousels
- Schedule posts at optimal times (analytics will show best times)
- Review calendar weekly to avoid gaps/overlaps

## SUCCESS METRICS
- Upload to publish time: <2 minutes
- Asset library search response: <500ms
- Social post success rate: 95%+ (with auto-retry on failure)
- Team collaboration: 5+ users active daily
- Storage cost: <$5/month for 100GB

## FINAL NOTES FOR AGENT
- All UI components use shadcn/ui primitives (copy from https://ui.shadcn.com)
- Follow Next.js 14 App Router conventions (Server Components by default, 'use client' only when needed)
- Use Server Actions for all mutations (no API routes for POST/PUT/DELETE)
- Implement loading.tsx and error.tsx for each route
- Add proper TypeScript types for all functions/components
- Deploy incrementally: Phase 1 (upload + library), Phase 2 (social scheduler)
- Test with real R2 credentials and at least 1 social account before full rollout

BUILD THIS AS A PRODUCTION-READY, ENTERPRISE-GRADE APPLICATION. FULL FUNCTIONALITY, ZERO PLACEHOLDERS. DEPLOY TO VERCEL WITH PROJECT ID: prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj
