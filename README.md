# MusicHub

> A forum for music lovers — share your favorite tracks, debate albums, and post hot takes about your top artists.

Final project for FAU Full-Stack Dev (Spring 2026). Built with React + Vite + Supabase, deployed on Netlify, with a Claude-powered post-summary feature.

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
- User accounts (email/password, Google sign-in, password reset, logout) via Supabase Auth
- AI-generated summary of any post (title + content + comments + upvotes) via Claude

## Local development

```bash
npm install
cp .env.example .env # fill in your Supabase + Anthropic keys
npm run dev
```

The app starts on http://localhost:5173.

> The app runs without a Supabase project too — until env vars are set,
> posts/comments are stored in your browser's localStorage.

## Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. In the dashboard go to **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it.
3. In **Settings → API**, copy your **Project URL** and **anon public key**
   into `.env`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
4. Restart the dev server. The app now reads/writes from Supabase.

## AI summary feature

Each post page has a "Generate summary" button that calls Google's Gemini
(via the `netlify/functions/summarize-post.js` serverless function) and
displays a 2-3 sentence summary of the post + comments + upvotes.

The Gemini API key never leaves the server. Set it in:

- **Netlify dashboard:** Site settings → Environment variables → add
  `GEMINI_API_KEY`.
- **Locally** (only if you run `netlify dev`): in your `.env` file.

Get a free Gemini API key at <https://aistudio.google.com/app/apikey>.

## Tech stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** Supabase (Postgres + Auth)
- **AI:** Google Gemini (via a Netlify serverless function)
- **Hosting:** Netlify
