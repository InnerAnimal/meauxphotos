# MeauxPhotos

Production-ready image optimization and social media management platform for Meauxbility brands.

## Features

- 🖼️ **Image Optimization**: Automatic WebP conversion with Sharp
- ☁️ **Cloudflare R2 Storage**: Zero egress fees, S3-compatible
- 📱 **Social Media Scheduling**: Multi-platform posting (Instagram, Facebook, TikTok, LinkedIn, YouTube, Snapchat)
- 👥 **Team Collaboration**: Role-based access control
- 📊 **Analytics Dashboard**: Track performance and engagement
- 🔍 **Asset Library**: Search, filter, and organize all your content

## Tech Stack

- **Framework**: Next.js 14.2+ (App Router, TypeScript, Server Actions)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Storage**: Cloudflare R2 (AWS SDK)
- **Database & Auth**: Supabase
- **Image Processing**: Sharp
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20.x
- npm or yarn
- Supabase account
- Cloudflare R2 bucket
- Social media developer accounts (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MeauxPhotos
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- Cloudflare R2 credentials
- Supabase URL and keys
- Social media API credentials (optional)

4. Set up Supabase database:

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  primary_color TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  brand_id UUID NOT NULL REFERENCES brands(id),
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, brand_id)
);

-- Create social_accounts table
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  brand_id UUID NOT NULL REFERENCES brands(id),
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'linkedin', 'youtube', 'snapchat')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  user_id UUID NOT NULL REFERENCES users(id),
  filename TEXT NOT NULL,
  r2_path TEXT NOT NULL,
  cdn_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document')),
  file_size BIGINT NOT NULL,
  dimensions JSONB,
  tags TEXT[] DEFAULT '{}',
  alt_text TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scheduled_posts table
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  assets TEXT[] DEFAULT '{}',
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed')),
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default brands
INSERT INTO brands (name, slug, primary_color) VALUES
  ('Meauxbility', 'meauxbility', '#FF6B00'),
  ('Inner Animals', 'inneranimals', '#8B5CF6'),
  ('iAutodidact', 'iautodidact', '#1F97A9');

-- Enable Row Level Security
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - adjust based on your needs)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Team members can view team data" ON team_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own assets" ON assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create assets" ON assets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own posts" ON scheduled_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create posts" ON scheduled_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

The project is configured for Vercel with:
- **Project ID**: `prj_66xE2dSIjXmhLLEEv1nDZFhkVmoj`
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Node Version**: 20.x

## Project Structure

```
/app
  /actions          # Server Actions
  /api              # API routes
  /dashboard        # Dashboard pages
  /upload           # Upload page
  /library          # Asset library
  /schedule         # Social media scheduler
  /analytics        # Analytics dashboard
  /team             # Team management
  /settings         # Settings
  /login            # Authentication

/components
  /ui               # shadcn/ui components
  /dashboard        # Dashboard components
  /upload           # Upload components
  /library          # Library components
  /schedule         # Scheduler components
  /analytics        # Analytics components
  /team             # Team components
  /settings         # Settings components

/lib
  /supabase         # Supabase utilities
  /r2               # Cloudflare R2 utilities
  /twilio           # Twilio SMS utilities
  /utils            # Utility functions
```

## Environment Variables

### Required Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ghiulqoqujsiofsjcrqk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6Wx6omNR-X-J4ifSdVAo_w_fuRi1XDB
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Cloudflare R2
R2_ACCESS_KEY_ID=914b9e2c6f3310295d94a46df9180156
R2_SECRET_ACCESS_KEY=a3dfb3efe4b66f734953f9ec35aa0611cd047e655d380a4cfeabc23befb75b90
R2_ENDPOINT=https://ede6590ac0d2fb7daf155b35653457b2.r2.cloudflarestorage.com
R2_BUCKET_NAME=meauxaccess-bucket
R2_ACCOUNT_ID=ede6590ac0d2fb7daf155b35653457b2
R2_PUBLIC_URL=https://cdn.meauxbility.org

# Social Media APIs (optional)
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
```

**Note:** If your Supabase project uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`, you can either:
1. Rename the environment variable to `NEXT_PUBLIC_SUPABASE_ANON_KEY` (recommended)
2. Or update `lib/supabase/client.ts` to use your custom key name

See `.env.example` for a template.

## License

MIT License - Copyright (c) 2025 Meauxbility

