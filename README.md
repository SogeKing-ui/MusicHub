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

## Tech stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** Supabase (Postgres + Auth)
- **AI:** Anthropic Claude (via a Netlify serverless function)
- **Hosting:** Netlify
