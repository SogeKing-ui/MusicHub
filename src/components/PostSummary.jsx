import { useState } from "react";
import { summarizePost } from "../lib/summarize.js";

// Drop-in component on the post detail page that fetches a Claude summary
// of the post + its comments and renders it in a styled card.
export default function PostSummary({ post, comments }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const text = await summarizePost({ post, comments });
      setSummary(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="summary">
      <header className="summary__header">
        <span className="summary__badge">AI summary</span>
        <button
          className="summary__btn"
          onClick={onGenerate}
          disabled={loading}
        >
          {loading
            ? "Summarizing..."
            : summary
            ? "Regenerate"
            : "Generate summary"}
        </button>
      </header>

      {summary && <p className="summary__body">{summary}</p>}
      {error && (
        <p className="summary__error">
          Couldn't generate a summary: {error}
        </p>
      )}
      {!summary && !error && !loading && (
        <p className="summary__placeholder">
          Click <strong>Generate summary</strong> to have Claude condense the
          post and its discussion into a couple sentences.
        </p>
      )}
    </section>
  );
}
