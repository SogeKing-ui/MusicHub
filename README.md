# MusicHub

> A forum for music lovers — share your favorite tracks, debate albums, and post hot takes about your top artists.

Final project for FAU Full-Stack Dev (Spring 2026). Built with React + Vite + Supabase, deployed on Netlify, with a Gemini-powered post-summary feature.

## Live demo

> 🌐 **Deployed app:** _coming soon — Netlify URL will go here_
>
> 🎬 **Demo video:** _coming soon — gif/video link will go here_

## Features

- Create posts with a title, optional content, and optional image URL
- Home feed with all posts (newest / most popular sorts)
- Search posts by title
- Dedicated page per post, with comments and an upvote button
- Edit and delete your own posts
- User accounts via Supabase Auth: email/password, Google sign-in, password reset, logout
- AI-generated summary of any post (title + content + comments + upvotes) via Google Gemini

## Local development

```bash
npm install
cp .env.example .env  # fill in your keys
npm run dev
```

The app starts on http://localhost:5173.

> The app also runs without any env vars — until Supabase is configured,
> posts and comments are stored in your browser's localStorage so you can
> still click around the UI.

## Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. **Settings → API** → copy your **Project URL** and **anon public key**
   into `.env`:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=ey...
   ```
4. **Authentication → Providers → Google** (optional, for Google sign-in):
   set up an OAuth client at <https://console.cloud.google.com> and paste
   the Client ID and Secret in.
5. Restart the dev server. The app now reads/writes from Supabase.

## AI summary feature

Each post page has a **Generate summary** button that calls Google Gemini
(via the `netlify/functions/summarize-post.js` serverless function) and
displays a 2-3 sentence summary of the post + comments + upvotes.

The Gemini API key never leaves the server. Set it in:

- **Netlify dashboard:** Site settings → Environment variables →
  `GEMINI_API_KEY`.
- **Locally** (only if you run `netlify dev`): in your `.env` file.

Get a free key at <https://aistudio.google.com/app/apikey>.

## Deploying to Netlify

1. Push the repo to GitHub.
2. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an
   existing project → GitHub** → pick this repo.
3. Build settings are auto-detected from `netlify.toml`
   (`npm run build` → `dist/`). Click **Deploy**.
4. Once the first deploy finishes, go to **Site settings → Environment
   variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
5. **Deploys → Trigger deploy → Clear cache and deploy site** so the new
   env vars are baked into the next build.
6. Copy your `*.netlify.app` URL.
7. Add that URL to:
   - **Supabase → Authentication → URL Configuration → Redirect URLs**
   - **Google Cloud → APIs & Services → Credentials → your OAuth client →
     Authorized JavaScript origins / redirect URIs** (so Google sign-in
     works in production)

## Tech stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** Supabase (Postgres + Auth)
- **AI:** Google Gemini (via a Netlify serverless function)
- **Hosting:** Netlify

## Project layout

```
.
├── netlify/functions/    # serverless functions (summarize-post)
├── public/               # static assets, favicon, _redirects
├── src/
│   ├── components/       # Header, PostCard, PostSummary, RequireAuth
│   ├── context/          # AuthContext
│   ├── lib/              # supabaseClient, postsStore, summarize, helpers
│   └── pages/            # Home, CreatePost, PostDetail, EditPost, auth
├── supabase/schema.sql   # database schema + RLS policies
├── netlify.toml          # build + functions config
└── vite.config.js
```
