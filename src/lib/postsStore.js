// Data layer for posts and comments.
//
// Uses Supabase when env vars are configured (production behavior).
// Falls back to a localStorage-backed store otherwise so the app keeps
// running while a developer is still wiring their Supabase project.
import { isSupabaseConfigured, supabase } from "./supabaseClient.js";
import { seedPosts, seedComments } from "./seedData.js";

// ---------- localStorage fallback ----------
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
function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
if (!isSupabaseConfigured) ensureSeeded();

// ---------- public API ----------
export async function getPosts() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }
  return read(POSTS_KEY, []);
}

export async function getPost(id) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
  return read(POSTS_KEY, []).find((p) => p.id === id) ?? null;
}

export async function createPost({ title, content, image_url }) {
  const fields = {
    title: title.trim(),
    content: content?.trim() || null,
    image_url: image_url?.trim() || null,
  };
  if (isSupabaseConfigured) {
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from("posts")
      .insert({ ...fields, user_id: user?.id ?? null })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const post = {
    id: uid("p"),
    ...fields,
    upvotes: 0,
    created_at: new Date().toISOString(),
  };
  const all = read(POSTS_KEY, []);
  write(POSTS_KEY, [post, ...all]);
  return post;
}

export async function updatePost(id, fields) {
  const patch = {
    title: fields.title?.trim(),
    content: fields.content?.trim() || null,
    image_url: fields.image_url?.trim() || null,
  };
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("posts")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const all = read(POSTS_KEY, []);
  const next = all.map((p) =>
    p.id === id
      ? { ...p, title: patch.title ?? p.title, content: patch.content, image_url: patch.image_url }
      : p
  );
  write(POSTS_KEY, next);
  return next.find((p) => p.id === id) ?? null;
}

export async function deletePost(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const all = read(POSTS_KEY, []);
  write(
    POSTS_KEY,
    all.filter((p) => p.id !== id)
  );
  const comments = read(COMMENTS_KEY, {});
  delete comments[id];
  write(COMMENTS_KEY, comments);
}

export async function upvotePost(id) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc("upvote_post", { post_id: id });
    if (error) throw error;
    return data;
  }
  const all = read(POSTS_KEY, []);
  const next = all.map((p) =>
    p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
  );
  write(POSTS_KEY, next);
  return next.find((p) => p.id === id)?.upvotes ?? 0;
}

export async function getComments(postId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
  }
  return read(COMMENTS_KEY, {})[postId] ?? [];
}

export async function addComment(postId, body) {
  const trimmed = body.trim();
  if (isSupabaseConfigured) {
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, body: trimmed, user_id: user?.id ?? null })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const all = read(COMMENTS_KEY, {});
  const c = { id: uid("c"), post_id: postId, body: trimmed };
  all[postId] = [...(all[postId] ?? []), c];
  write(COMMENTS_KEY, all);
  return c;
}
