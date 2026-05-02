import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard.jsx";
import { getPosts } from "../lib/postsStore.js";

const SORTS = {
  newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  popular: (a, b) => b.upvotes - a.upvotes,
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("newest");
  const [params] = useSearchParams();
  const search = (params.get("q") ?? "").trim().toLowerCase();

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const visible = useMemo(() => {
    const filtered = search
      ? posts.filter((p) => p.title.toLowerCase().includes(search))
      : posts;
    return [...filtered].sort(SORTS[sort]);
  }, [sort, search, posts]);

  return (
    <div className="page">
      <div className="sort-bar">
        <span className="sort-bar__label">Order by:</span>
        <button
          className={`pill ${sort === "newest" ? "pill--active" : ""}`}
          onClick={() => setSort("newest")}
        >
          Newest
        </button>
        <button
          className={`pill ${sort === "popular" ? "pill--active" : ""}`}
          onClick={() => setSort("popular")}
        >
          Most Popular
        </button>
      </div>

      {search && (
        <p className="search-note">
          Showing results for <strong>"{search}"</strong>
        </p>
      )}

      <div className="feed">
        {visible.length === 0 ? (
          <p className="empty">No posts yet — be the first to start the conversation.</p>
        ) : (
          visible.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
