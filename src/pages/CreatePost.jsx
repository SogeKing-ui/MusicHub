import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../lib/postsStore.js";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("A title is required.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const post = await createPost({
        title,
        content,
        image_url: imageUrl,
      });
      navigate(`/post/${post.id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="page form-page">
      <form className="card form" onSubmit={onSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input input--textarea"
          placeholder="Content (Optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        <input
          className="input"
          type="url"
          placeholder="Image URL (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {error && <p className="form__error">{error}</p>}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
