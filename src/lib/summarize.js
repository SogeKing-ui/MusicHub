// Calls the /summarize-post Netlify function.
export async function summarizePost({ post, comments }) {
  const res = await fetch("/.netlify/functions/summarize-post", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      upvotes: post.upvotes,
      comments: comments.map((c) => ({ body: c.body })),
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j.error ?? "";
    } catch {
      detail = await res.text();
    }
    throw new Error(detail || `Summary request failed (${res.status})`);
  }

  const data = await res.json();
  return data.summary;
}
