import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addComment,
  deletePost,
  getComments,
  getPost,
  upvotePost,
} from "../lib/postsStore.js";
import { timeAgo } from "../lib/timeAgo.js";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getPost(id), getComments(id)]).then(([p, c]) => {
      if (cancelled) return;
      if (!p) {
        setNotFound(true);
      } else {
        setPost(p);
        setComments(c);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onUpvote() {
    const next = await upvotePost(id);
    setPost((p) => ({ ...p, upvotes: next }));
  }

  async function onDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await deletePost(id);
    navigate("/");
  }

  async function onAddComment(e) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    const c = await addComment(id, body);
    setComments((cs) => [...cs, c]);
    setDraft("");
  }

  if (loading) return <div className="page"><p className="empty">Loading…</p></div>;
  if (notFound)
    return (
      <div className="page">
        <p className="empty">
          Post not found. <Link to="/">Back home</Link>
        </p>
      </div>
    );

  return (
    <div className="page">
      <article className="card detail">
        <p className="card__meta">Posted {timeAgo(post.created_at)}</p>
        <h1 className="detail__title">{post.title}</h1>

        {post.content && <p className="detail__content">{post.content}</p>}
        {post.image_url && (
          <img className="detail__image" src={post.image_url} alt="" />
        )}

        <div className="detail__actions">
          <button className="upvote" onClick={onUpvote} aria-label="Upvote">
            <span className="upvote__icon">▲</span>
            <span>{post.upvotes} upvotes</span>
          </button>

          <div className="detail__icon-actions">
            <Link
              to={`/post/${post.id}/edit`}
              className="icon-button"
              title="Edit post"
              aria-label="Edit post"
            >
              ✎
            </Link>
            <button
              className="icon-button"
              onClick={onDelete}
              title="Delete post"
              aria-label="Delete post"
            >
              🗑
            </button>
          </div>
        </div>

        <section className="comments">
          {comments.length === 0 ? (
            <p className="comments__empty">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <p key={c.id} className="comment">
                — {c.body}
              </p>
            ))
          )}
          <form className="comments__form" onSubmit={onAddComment}>
            <input
              className="input"
              type="text"
              placeholder="Leave a comment..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </form>
        </section>
      </article>
    </div>
  );
}
