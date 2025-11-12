# MEAUXPHOTOS - IMPLEMENTATION GUIDE

## 🎯 OBJECTIVE
Deploy a fully functional image optimization and social media management platform to https://meauxphotos.vercel.app

## 📋 PREREQUISITES COMPLETED
✅ GitHub repo created: InnerAnimal/meauxphotos
✅ Vercel project created: prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj
✅ Domain configured: meauxphotos.vercel.app
✅ R2 bucket exists: meauxaccess-bucket
✅ Environment variables added in Vercel

---

## 🚀 DEPLOYMENT STEPS

### OPTION 1: Use AI Agent (RECOMMENDED)

**Copy the MASTERPROMPT.md file and paste into:**
- GitHub Copilot Workspace
- Cursor AI with Agent mode
- Claude with Artifacts enabled
- ChatGPT with Code Interpreter

**What the agent will build:**
- Complete Next.js 14 app with all features
- Full file structure with proper routing
- Working R2 upload integration
- Supabase authentication
- Social media OAuth flows
- Asset library with search
- Post scheduler with calendar
- Analytics dashboard
- Team management

**Agent Instructions:**
"Build this entire application based on the MASTERPROMPT.md specifications. Use Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui components, Cloudflare R2 for storage, and Supabase for authentication and database. Deploy to Vercel project prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj. Make it production-ready with zero placeholders."

### OPTION 2: Manual Build

**Phase 1: Core Setup (Day 1)**
1. Initialize Next.js project
2. Configure Tailwind + shadcn/ui
3. Set up Supabase client
4. Create auth pages (login/signup)
5. Build dashboard layout with sidebar
6. Deploy to Vercel (verify it works)

**Phase 2: Upload System (Day 2-3)**
1. Create upload page with drag-drop
2. Implement R2 upload API route
3. Add Sharp image optimization
4. Build asset library grid
5. Add search and filter functionality
6. Test upload → optimize → view workflow

**Phase 3: Social Media (Day 4-5)**
1. Set up OAuth for Meta (Instagram/Facebook)
2. Create post composer UI
3. Implement scheduled posts (Supabase table)
4. Build calendar view
5. Create cron job for publishing scheduled posts
6. Add TikTok/LinkedIn/YouTube integrations

**Phase 4: Polish (Day 6-7)**
1. Add analytics dashboard
2. Build team management
3. Implement notifications
4. Error handling and retry logic
5. Performance optimization
6. Final testing with real accounts

---

## 🔧 CRITICAL CONFIGURATION

### Vercel Environment Variables (Already Set)
Verify these are in your Vercel project settings:

```bash
# Cloudflare R2
R2_ACCESS_KEY_ID=914b9e2c6f3310295d94a46df9180156
R2_SECRET_ACCESS_KEY=a3dfb3efe4b66f734953f9ec35aa0611cd047e655d380a4cfeabc23befb75b90
R2_ENDPOINT=https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com
R2_BUCKET_NAME=meauxaccess-bucket
R2_PUBLIC_URL=https://pub-[subdomain].r2.dev (or custom domain)

# Supabase (need to add)
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]

# Social Media APIs (need to obtain)
META_APP_ID=[from Facebook Developers]
META_APP_SECRET=[from Facebook Developers]
TIKTOK_CLIENT_KEY=[from TikTok Developers]
TIKTOK_CLIENT_SECRET=[from TikTok Developers]
LINKEDIN_CLIENT_ID=[from LinkedIn Developers]
LINKEDIN_CLIENT_SECRET=[from LinkedIn Developers]
YOUTUBE_CLIENT_ID=[from Google Cloud Console]
YOUTUBE_CLIENT_SECRET=[from Google Cloud Console]

# App Config
NEXT_PUBLIC_APP_URL=https://meauxphotos.vercel.app
NEXTAUTH_SECRET=[generate random string]
```

### R2 Public Access Setup
1. Go to Cloudflare Dashboard → R2 → meauxaccess-bucket
2. Settings → Public Access → Enable
3. **Option A:** Use R2.dev subdomain (instant, free)
   - Format: `https://pub-abc123.r2.dev`
4. **Option B:** Custom domain (recommended for production)
   - Add custom domain: `cdn.meauxbility.org`
   - Update DNS records in Cloudflare

**Update R2_PUBLIC_URL env var with your chosen option**

### Supabase Setup
1. Create project at https://supabase.com
2. Go to Project Settings → API
3. Copy URL and anon key to Vercel env vars
4. Run SQL schema (provided in MASTERPROMPT.md)
5. Enable Row Level Security (RLS) on all tables

### Social Media Developer Accounts

**Facebook/Instagram (Meta):**
1. Go to https://developers.facebook.com
2. Create App → Business → Add Instagram API
3. Get App ID and App Secret
4. Add redirect URI: `https://meauxphotos.vercel.app/api/auth/callback/meta`
5. Submit for review (permissions: instagram_content_publish)

**TikTok:**
1. Go to https://developers.tiktok.com
2. Register as developer
3. Create app → Add Content Posting API
4. Get Client Key and Secret
5. Add redirect URI: `https://meauxphotos.vercel.app/api/auth/callback/tiktok`

**LinkedIn:**
1. Go to https://www.linkedin.com/developers
2. Create App
3. Add OAuth 2.0 redirect URL: `https://meauxphotos.vercel.app/api/auth/callback/linkedin`
4. Request access to Share on LinkedIn API

**YouTube:**
1. Go to https://console.cloud.google.com
2. Create project → Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Add redirect URI: `https://meauxphotos.vercel.app/api/auth/callback/youtube`

**Note:** Social integrations can be added incrementally. Start with Instagram/Facebook (most important for Meauxbility)

---

## 📦 DEPENDENCIES TO INSTALL

Run in your project directory:

```bash
npm install next@14.2.15 react@18.3.1 react-dom@18.3.1
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
npm install sharp axios date-fns lucide-react
npm install react-dropzone react-calendar recharts zustand zod
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint eslint-config-next
```

Or use the package.json from MASTERPROMPT.md

---

## ✅ TESTING CHECKLIST

Before going live, test these workflows:

**Authentication:**
- [ ] Sign up new user
- [ ] Login existing user
- [ ] Password reset
- [ ] Logout

**Upload:**
- [ ] Drag-drop single image
- [ ] Drag-drop multiple images
- [ ] Upload video
- [ ] Large file (40MB) optimization
- [ ] Verify WebP conversion
- [ ] Check R2 storage (file exists)
- [ ] Copy CDN URL and open in browser

**Asset Library:**
- [ ] Search by filename
- [ ] Filter by brand
- [ ] Filter by date
- [ ] Bulk select and delete
- [ ] Download asset
- [ ] View asset details

**Social Media:**
- [ ] Connect Instagram account
- [ ] Create post with single image
- [ ] Create carousel post (multiple images)
- [ ] Schedule post for future
- [ ] Post immediately
- [ ] Verify post appears on Instagram
- [ ] Check calendar view shows scheduled post

**Team:**
- [ ] Invite new team member
- [ ] New member can login
- [ ] Role permissions work (Editor can't delete users)
- [ ] Activity log shows actions

**Analytics:**
- [ ] View post performance data
- [ ] Check storage usage stats
- [ ] Download report

---

## 🐛 TROUBLESHOOTING

**Build fails on Vercel:**
- Check build logs for specific error
- Verify all env vars are set correctly
- Ensure Node version is 18.x or 20.x
- Try deploying a simple Next.js app first to isolate issue

**R2 uploads fail:**
- Verify credentials are correct (copy-paste carefully)
- Check R2 bucket exists: `meauxaccess-bucket`
- Test credentials with AWS CLI: `aws s3 ls --endpoint-url $R2_ENDPOINT`
- Ensure bucket has proper CORS policy

**Social media posts fail:**
- Check if access token is expired (reconnect account)
- Verify app is approved for production use
- Check platform-specific rate limits
- Review error logs in Vercel

**Images not loading:**
- Verify R2_PUBLIC_URL is set correctly
- Check if R2 public access is enabled
- Test CDN URL directly in browser
- Check Next.js Image component domains config

---

## 📊 SUCCESS METRICS

**Week 1:**
- [ ] 10+ assets uploaded
- [ ] 5+ posts scheduled
- [ ] 2+ team members active
- [ ] All social accounts connected

**Month 1:**
- [ ] 100+ assets in library
- [ ] 50+ posts published
- [ ] 5+ team members active
- [ ] <$5 in R2 storage costs
- [ ] 90%+ post success rate

---

## 🎓 TRAINING RESOURCES

**For Team:**
1. Share TEAM-ONBOARDING.md with all users
2. Record 5-min Loom video walkthrough
3. Host 30-min live onboarding session
4. Create quick reference card (print or PDF)

**For Developers:**
1. Read MASTERPROMPT.md fully
2. Review Next.js 14 App Router docs
3. Study Cloudflare R2 API docs
4. Understand OAuth 2.0 flow for each platform

---

## 📞 SUPPORT CONTACTS

**Technical Issues:**
- Sam Primeaux: sam@meauxbility.org
- Connor McNeely (CTO): connor@meauxbility.org

**Vercel Support:**
- https://vercel.com/support
- Vercel Dashboard → Help

**Cloudflare Support:**
- https://dash.cloudflare.com → Support

**Supabase Support:**
- https://supabase.com/support
- Discord: https://discord.supabase.com

---

## 🔄 NEXT STEPS AFTER LAUNCH

**Phase 2 Features (Future):**
1. AI-powered caption generation (OpenAI API)
2. Hashtag recommendations based on image content
3. Best time to post suggestions (ML model)
4. Multi-user commenting on assets
5. Version history for edited images
6. Zapier integration for workflow automation
7. Mobile app (React Native)
8. Advanced analytics (engagement predictions)

**Maintenance:**
- Weekly: Review error logs, check storage costs
- Monthly: Update dependencies, review social API changes
- Quarterly: User feedback survey, feature prioritization

---

## ✨ FINAL NOTES

This application is designed to be:
- **Production-ready:** No placeholders, full functionality
- **Scalable:** Handles 1000+ assets, 100+ posts/day
- **Maintainable:** Clear code structure, TypeScript types
- **User-friendly:** Intuitive UI, helpful error messages
- **Cost-effective:** <$10/month for typical usage

**The goal:** Make content management effortless so your team can focus on creating amazing content, not managing files.

---

**Ready to build?** Copy MASTERPROMPT.md and start coding! 🚀

Or paste into AI agent and let it build for you.

Good luck! 🎉
