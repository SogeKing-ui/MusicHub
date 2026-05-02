import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost } from "../lib/postsStore.js";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPost(id).then((p) => {
      if (!p) {
        setNotFound(true);
      } else {
        setTitle(p.title);
        setContent(p.content ?? "");
        setImageUrl(p.image_url ?? "");
      }
      setLoading(false);
    });
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await updatePost(id, { title, content, image_url: imageUrl });
      navigate(`/post/${id}`);
    } catch (err) {
      console.error(err);
      setError("Could not update the post. Try again.");
      setSubmitting(false);
    }
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
    <div className="page form-page">
      <form className="card form" onSubmit={onSubmit}>
        <input
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input input--textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        <input
          className="input"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {error && <p className="form__error">{error}</p>}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}
