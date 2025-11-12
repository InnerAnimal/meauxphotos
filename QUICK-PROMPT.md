# MEAUXPHOTOS - ONE-SHOT BUILD PROMPT

Build production Next.js 14 app for image optimization + social media management. Deploy to Vercel project prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj at meauxphotos.vercel.app

**STACK:** Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Cloudflare R2 (AWS SDK), Supabase (auth+DB), Sharp optimization

**FEATURES:**
1. Dashboard: Stats, quick actions, brand switcher (Meauxbility/Inner Animals/iAutodidact)
2. Upload: Drag-drop, auto WebP conversion via Sharp, R2 storage, progress tracking
3. Asset Library: Grid with search/filter, copy CDN URLs, bulk actions
4. Social Scheduler: Multi-platform posting (Instagram, Facebook, TikTok, LinkedIn, YouTube, Snapchat), calendar view, OAuth per platform
5. Team Auth: Supabase email/password, role-based access, invite system
6. Analytics: Post performance, storage usage, upload trends

**R2 CONFIG (from env):**
- ACCESS_KEY: 914b9e2c6f3310295d94a46df9180156
- SECRET: a3dfb3efe4b66f734953f9ec35aa0611cd047e655d380a4cfeabc23befb75b90
- ENDPOINT: https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com
- BUCKET: meauxaccess-bucket
- Structure: /brand/images/YYYY/MM/filename.webp

**SUPABASE TABLES:**
users, team_members, brands, social_accounts, assets (r2_path, cdn_url, tags), scheduled_posts (platforms[], scheduled_for, status)

**DESIGN:**
- Colors: #1F97A9 primary, #FF6B00 Meauxbility orange, glass-morphism cards
- Fixed sidebar (280px), Inter font, gradient buttons, hover effects
- Responsive grid layouts, infinite scroll

**UPLOAD FLOW:**
File → Sharp (resize 1920px, WebP 85%) → R2 PutObject → Save Supabase → Return CDN URL

**SOCIAL FLOW:**
Compose → Select assets → Write caption → Toggle platforms → Schedule → Server Action posts at time → Save analytics

**CRITICAL:**
- Use Server Actions (no API routes for mutations)
- shadcn/ui components only
- Proper TypeScript types
- Row-level security in Supabase
- OAuth for each social platform (Meta Graph, TikTok API, LinkedIn API, YouTube Data v3)
- File validation server-side
- Optimistic UI updates

**FILE STRUCTURE:**
/app: dashboard, upload, library, schedule, analytics, team, settings pages + /api/upload, /api/social routes
/components: ui (shadcn), dashboard, upload, library, schedule modules
/lib: supabase, r2, social platform helpers

**DEPS:** @supabase/supabase-js, @aws-sdk/client-s3, sharp, react-dropzone, date-fns, lucide-react, recharts

**ENV VARS:** R2 creds above + Supabase URL/keys + social API keys (META_APP_ID, TIKTOK_CLIENT_KEY, etc.)

**VERCEL SETTINGS:** Framework=Next.js, Build=npm run build, Output=.next, Node=20.x

BUILD COMPLETE WORKING APP. ZERO PLACEHOLDERS. PRODUCTION-READY. FULL SOCIAL INTEGRATIONS.
