# MeauxPhotos Deployment Information

## 🚀 Deployment URL

**Production URL:** `https://meauxphotos.vercel.app`

**Vercel Project ID:** `prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj`

---

## 📋 What This Deployment Does

MeauxPhotos is a **production-ready image optimization and social media management platform** for Meauxbility brands (Meauxbility, Inner Animals, iAutodidact).

### Core Features:

1. **📤 Image Upload & Optimization**
   - Drag-and-drop file upload
   - Automatic WebP conversion (Sharp optimization)
   - Resize to max 1920px width
   - Store optimized images in Cloudflare R2

2. **📚 Asset Library**
   - Browse all uploaded assets
   - Search by filename or tags
   - Filter by brand and file type
   - Copy CDN URLs
   - Download optimized versions

3. **📅 Social Media Scheduler**
   - Compose posts with captions
   - Select assets from library
   - Schedule posts for multiple platforms:
     - Instagram
     - Facebook
     - TikTok
     - LinkedIn
     - YouTube
     - Snapchat
   - Calendar view for scheduled posts
   - Save drafts

4. **📊 Analytics Dashboard**
   - Total assets count
   - Storage usage tracking
   - Scheduled vs posted posts
   - Team member statistics

5. **👥 Team Management**
   - Invite team members
   - Role-based access (Owner, Admin, Editor, Viewer)
   - Brand-specific permissions

6. **⚙️ Settings**
   - Profile management
   - Social account connections
   - Notification preferences

---

## 🔐 Authentication & User Accounts

**IMPORTANT:** This application uses **Supabase Authentication**. There are **NO default test users** configured.

### To Create User Accounts:

1. **Via Supabase Dashboard:**
   - Go to your Supabase project: `https://ghiulqoqujsiofsjcrqk.supabase.co`
   - Navigate to Authentication → Users
   - Click "Add User" → "Create new user"
   - Enter email and password
   - User will be created in `auth.users` table

2. **Via Application Sign-Up:**
   - Visit `https://meauxphotos.vercel.app/login`
   - Click "Sign Up" (if signup page exists)
   - Or create users through Supabase dashboard first

3. **After Creating Users:**
   - Users need to be added to the `users` table in Supabase
   - Run this SQL for each user (replace with actual user ID from auth.users):
   ```sql
   INSERT INTO users (id, email, full_name, role)
   VALUES (
     'user-uuid-from-auth-users',
     'user@example.com',
     'User Name',
     'admin'  -- or 'owner', 'editor', 'viewer'
   );
   ```

### Current User Accounts:

**⚠️ NO USERS CONFIGURED YET**

You need to create users in Supabase. Here's what you need to do:

1. Create users in Supabase Authentication dashboard
2. Insert user records into the `users` table
3. Optionally add them to `team_members` table for brand access

---

## 🔑 Environment Variables Checklist

Use this checklist to ensure all environment variables are entered in Vercel (Project Settings → Environment Variables):

### ✅ Supabase (REQUIRED)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://ghiulqoqujsiofsjcrqk.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_6Wx6omNR-X-J4ifSdVAo_w_fuRi1XDB`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `[GET FROM SUPABASE DASHBOARD]`

### ✅ Twilio (REQUIRED)
- [ ] `TWILIO_ACCOUNT_SID` = `[YOUR_TWILIO_ACCOUNT_SID]`
- [ ] `TWILIO_AUTH_TOKEN` = `[YOUR_TWILIO_AUTH_TOKEN]`
- [ ] `TWILIO_PHONE_NUMBER` = `[YOUR TWILIO PHONE NUMBER]`

### ✅ Cloudflare R2 (REQUIRED)
- [ ] `R2_ACCESS_KEY_ID` = `914b9e2c6f3310295d94a46df9180156`
- [ ] `R2_SECRET_ACCESS_KEY` = `a3dfb3efe4b66f734953f9ec35aa0611cd047e655d380a4cfeabc23befb75b90`
- [ ] `R2_ENDPOINT` = `https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com`
- [ ] `R2_BUCKET_NAME` = `meauxaccess-bucket`
- [ ] `R2_ACCOUNT_ID` = `ede6590ac0d2fb7daf155b35653457b2`
- [ ] `R2_PUBLIC_URL` = `https://cdn.meauxbility.org`

### ⚠️ Social Media APIs (OPTIONAL - for social posting features)
- [ ] `META_APP_ID` = `[FROM FACEBOOK DEVELOPERS]`
- [ ] `META_APP_SECRET` = `[FROM FACEBOOK DEVELOPERS]`
- [ ] `TIKTOK_CLIENT_KEY` = `[FROM TIKTOK DEVELOPERS]`
- [ ] `TIKTOK_CLIENT_SECRET` = `[FROM TIKTOK DEVELOPERS]`
- [ ] `LINKEDIN_CLIENT_ID` = `[FROM LINKEDIN DEVELOPERS]`
- [ ] `LINKEDIN_CLIENT_SECRET` = `[FROM LINKEDIN DEVELOPERS]`
- [ ] `YOUTUBE_CLIENT_ID` = `[FROM GOOGLE CLOUD CONSOLE]`
- [ ] `YOUTUBE_CLIENT_SECRET` = `[FROM GOOGLE CLOUD CONSOLE]`
- [ ] `SNAPCHAT_CLIENT_ID` = `[FROM SNAPCHAT DEVELOPERS]`
- [ ] `SNAPCHAT_CLIENT_SECRET` = `[FROM SNAPCHAT DEVELOPERS]`

### ✅ App Configuration (REQUIRED)
- [ ] `NEXT_PUBLIC_APP_URL` = `https://meauxphotos.vercel.app`
- [ ] `NEXTAUTH_SECRET` = `[GENERATE RANDOM STRING]`

---

## 📝 Missing Values You Need to Get:

1. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Go to: https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk/settings/api
   - Copy the "service_role" key (keep this secret!)

2. **`TWILIO_PHONE_NUMBER`**
   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
   - Copy your Twilio phone number (format: +1234567890)

3. **`NEXTAUTH_SECRET`**
   - Generate a random string (32+ characters)
   - Or run: `openssl rand -base64 32`

---

## 🎯 Quick Setup Steps for Connor/Sam:

1. **Add all environment variables to Vercel:**
   - Go to: https://vercel.com/dashboard
   - Select project: `meauxphotos` (or project ID: `prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj`)
   - Settings → Environment Variables
   - Add each variable from the checklist above
   - **Important:** Set for Production, Preview, AND Development environments

2. **Create first admin user:**
   - Go to Supabase: https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk/auth/users
   - Create a new user (email/password)
   - Note the user ID
   - Run SQL in Supabase SQL Editor:
   ```sql
   INSERT INTO users (id, email, full_name, role)
   VALUES (
     'USER_ID_FROM_AUTH',
     'your-email@example.com',
     'Your Name',
     'owner'
   );
   ```

3. **Test the deployment:**
   - Visit: https://meauxphotos.vercel.app
   - Login with the user you created
   - Test upload functionality
   - Verify R2 storage is working

---

## 🔗 Important Links:

- **App URL:** https://meauxphotos.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ghiulqoqujsiofsjcrqk
- **Cloudflare R2:** https://dash.cloudflare.com
- **Twilio Console:** https://console.twilio.com

---

## 📞 Support:

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Verify all environment variables are set correctly
4. Ensure database tables are created (see README.md SQL setup)

