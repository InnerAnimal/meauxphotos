# 🚀 Deploy MeauxPhotos to Vercel - Step by Step

## Current Status: ⚠️ NOT DEPLOYED YET

The project exists locally but hasn't been deployed to Vercel. Follow these steps:

---

## Option 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd /Users/samprimeaux/Downloads/MeauxPhotos
vercel
```

Follow the prompts:
- Link to existing project? **Yes**
- Project name: `meauxphotos` (or use project ID: `prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj`)
- Directory: `./`
- Override settings? **No**

### Step 4: Add Environment Variables
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_PHONE_NUMBER
# ... (add all other env vars)
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

---

## Option 2: Deploy via GitHub + Vercel Dashboard (Recommended)

### Step 1: Initialize Git Repository
```bash
cd /Users/samprimeaux/Downloads/MeauxPhotos
git init
git add .
git commit -m "Initial MeauxPhotos deployment"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., `meauxphotos`)
3. **Don't** initialize with README (we already have one)

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/meauxphotos.git
git branch -M main
git push -u origin main
```

### Step 4: Import to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
   - **Node Version:** 20.x

### Step 5: Add Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` = `https://ghiulqoqujsiofsjcrqk.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_6Wx6omNR-X-J4ifSdVAo_w_fuRi1XDB`
- `SUPABASE_SERVICE_ROLE_KEY` = `[GET FROM SUPABASE]`
- `TWILIO_ACCOUNT_SID` = `[YOUR_TWILIO_ACCOUNT_SID]`
- `TWILIO_AUTH_TOKEN` = `[YOUR_TWILIO_AUTH_TOKEN]`
- `TWILIO_PHONE_NUMBER` = `[YOUR TWILIO NUMBER]`
- `R2_ACCESS_KEY_ID` = `914b9e2c6f3310295d94a46df9180156`
- `R2_SECRET_ACCESS_KEY` = `a3dfb3efe4b66f734953f9ec35aa0611cd047e655d380a4cfeabc23befb75b90`
- `R2_ENDPOINT` = `https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com`
- `R2_BUCKET_NAME` = `meauxaccess-bucket`
- `R2_ACCOUNT_ID` = `ede6590ac0d2fb7daf155b35653457b2`
- `R2_PUBLIC_URL` = `https://cdn.meauxbility.org`
- `NEXT_PUBLIC_APP_URL` = `https://meauxphotos.vercel.app`
- `NEXTAUTH_SECRET` = `[GENERATE RANDOM STRING]`

**Important:** Set these for **Production**, **Preview**, AND **Development** environments.

### Step 6: Deploy
Click "Deploy" button. Vercel will automatically build and deploy.

---

## Option 3: Create Project First, Then Deploy

If the project ID `prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj` doesn't exist:

1. Go to https://vercel.com/new
2. Create a new project manually
3. Name it: `meauxphotos`
4. Then follow Option 2 steps above

---

## After Deployment

Once deployed, your app will be available at:
- **Production:** `https://meauxphotos.vercel.app`
- **Preview:** `https://meauxphotos-[hash].vercel.app`

---

## Troubleshooting

### If you get "Project not found":
- The project doesn't exist in Vercel yet
- Create it using Option 2 or Option 3 above

### If deployment fails:
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `package.json` has all dependencies
- Check Node.js version (should be 20.x)

### If you get build errors:
- Run `npm install` locally first
- Check for TypeScript errors: `npm run build`
- Verify all imports are correct

---

## Quick Deploy Command (if using Vercel CLI)

```bash
# One-liner to deploy
cd /Users/samprimeaux/Downloads/MeauxPhotos && vercel --prod
```

