// Local store backed by localStorage. Used during development before
// Supabase is wired up. Same function signatures as the Supabase-backed
// version so the swap is a one-file change.
import { seedPosts, seedComments } from "./seedData.js";

const POSTS_KEY = "musichub.posts";
const COMMENTS_KEY = "musichub.comments";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  if (!localStorage.getItem(POSTS_KEY)) write(POSTS_KEY, seedPosts);
  if (!localStorage.getItem(COMMENTS_KEY)) write(COMMENTS_KEY, seedComments);
}
ensureSeeded();

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getPosts() {
  return read(POSTS_KEY, []);
}

export async function getPost(id) {
  const posts = read(POSTS_KEY, []);
  return posts.find((p) => p.id === id) ?? null;
}

export async function createPost({ title, content, image_url }) {
  const posts = read(POSTS_KEY, []);
  const post = {
    id: uid("p"),
    title: title.trim(),
    content: content?.trim() || null,
    image_url: image_url?.trim() || null,
    upvotes: 0,
    created_at: new Date().toISOString(),
  };
  write(POSTS_KEY, [post, ...posts]);
  return post;
}

export async function updatePost(id, fields) {
  const posts = read(POSTS_KEY, []);
  const next = posts.map((p) =>
    p.id === id
      ? {
          ...p,
          title: fields.title?.trim() ?? p.title,
          content: fields.content?.trim() || null,
          image_url: fields.image_url?.trim() || null,
        }
      : p
  );
  write(POSTS_KEY, next);
  return next.find((p) => p.id === id) ?? null;
}

export async function deletePost(id) {
  const posts = read(POSTS_KEY, []);
  write(
    POSTS_KEY,
    posts.filter((p) => p.id !== id)
  );
  const comments = read(COMMENTS_KEY, {});
  delete comments[id];
  write(COMMENTS_KEY, comments);
}

export async function upvotePost(id) {
  const posts = read(POSTS_KEY, []);
  const next = posts.map((p) =>
    p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
  );
  write(POSTS_KEY, next);
  return next.find((p) => p.id === id)?.upvotes ?? 0;
}

export async function getComments(postId) {
  const all = read(COMMENTS_KEY, {});
  return all[postId] ?? [];
}

export async function addComment(postId, body) {
  const all = read(COMMENTS_KEY, {});
  const comment = { id: uid("c"), post_id: postId, body: body.trim() };
  all[postId] = [...(all[postId] ?? []), comment];
  write(COMMENTS_KEY, all);
  return comment;
}
