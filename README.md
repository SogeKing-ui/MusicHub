# Web Development Final Project - *MusicHub*

Submitted by: **Jehu**

This web app: **A forum for music lovers — create posts about your favorite tracks, albums, or artists, browse a home feed of everyone's takes, sort by newest or most popular, search by title, leave comments, upvote posts, and read AI-generated summaries of any post and its discussion. Built with React + Vite, backed by Supabase for auth and storage, and deployed on Netlify with a Gemini-powered serverless function for the LLM summaries.**

🌐 **Live app:** <https://musichub-jehu.netlify.app>

Time spent: **X** hours spent in total

## Required Features

The following **required** functionality is completed:


- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add:
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page.
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [ ] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [ ] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [ ] Users can add more characterics to their posts
  - Users can share and view web videos
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
  - Users can upload images directly from their local machine as an image file
- [ ] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] **Web App Deployment** — deployed to Netlify with continuous deploys via the Netlify CLI. Live URL: <https://musichub-jehu.netlify.app>
* [x] **Real authentication tied to Supabase** (goes beyond pseudo-auth)
  - Email/password sign up
  - Email/password log in
  - Continue with Google (OAuth)
  - Forgot-password / reset-password email flow
  - Logout from the header
  - Row-level security policies so only post authors can edit or delete their own posts
* [x] **LLM-powered post summary** — every post page has a "Generate summary" button that calls a Netlify serverless function (`netlify/functions/summarize-post.js`), which forwards the post title, content, image flag, upvote count, and full comment list to Google Gemini and returns a concise 2-3 sentence summary, displayed in a styled card on the post page. The Gemini API key lives only in the function's environment, never in the browser.
* [x] **Polished UI** — teal-themed header with sticky positioning, search bar, hover-lift card animation, gradient AI summary card, mobile-responsive layout, custom favicon.
* [x] **Sensible repo hygiene** — `.env.example` template, `supabase/schema.sql` checked in for one-click backend reproduction, `netlify.toml` with SPA fallback redirects, idempotent SQL policies that are safe to re-run.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

Describe any challenges encountered while building the app.

A few real ones worth calling out:

- **GitHub Classroom org permissions** blocked installing third-party apps (including Netlify) on the assignment repo, so I deployed via the Netlify CLI (`netlify deploy --build --prod`) instead of the standard GitHub integration.
- **Gemini free-tier quirks**: my Google account was issued `limit: 0` on `gemini-2.0-flash` regardless of which project the API key was created in, and `gemini-1.5-flash` had been deprecated from `v1beta`. Settled on `gemini-2.5-flash`, which had a healthy free quota.
- **Supabase RLS**: started with permissive insert policies during development so the UI could be exercised end-to-end without auth, then tightened them to `auth.uid() = user_id` once login/signup was wired up. The schema file's `drop policy if exists ... create policy ...` pattern made re-running it safe across iterations.
- **Pre-Supabase development**: the data layer (`src/lib/postsStore.js`) transparently falls back to `localStorage` when Supabase env vars aren't set, so the app stays clickable before the backend is configured. Same function signatures as the Supabase path — swap is a one-file change.

## License

    Copyright 2026 Jehu

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
