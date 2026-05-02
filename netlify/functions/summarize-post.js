// Netlify Function: POST a post payload, get back a Gemini-generated
// summary that captures the post and the discussion in the comments.
//
// The Gemini API key lives in the function's environment, never in
// the browser. Set it in Netlify dashboard -> Site settings ->
// Environment variables (and locally in .env if you run `netlify dev`).

const MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export default async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: "Server is missing GEMINI_API_KEY" }, 500);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { title, content, image_url, upvotes = 0, comments = [] } = body;
  if (!title) return json({ error: "Missing post title" }, 400);

  const commentsBlock = comments.length
    ? comments.map((c, i) => `${i + 1}. ${c.body}`).join("\n")
    : "(no comments yet)";

  const prompt = `You are writing a friendly 2-3 sentence summary of a forum post on MusicHub, a community for music lovers. Capture the gist of the post and where the discussion in the comments is going. Keep it concise and conversational. Do not start with "This post" — just summarize directly.

Post title: ${title}
Post content: ${content?.trim() || "(no body provided)"}
Upvotes: ${upvotes}
Image attached: ${image_url ? "yes" : "no"}

Comments:
${commentsBlock}`;

  let res;
  try {
    res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
      }),
    });
  } catch (err) {
    return json({ error: `Network error: ${err.message}` }, 502);
  }

  if (!res.ok) {
    const errText = await res.text();
    return json({ error: errText || `Gemini error ${res.status}` }, 502);
  }

  const data = await res.json();
  const summary =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

  if (!summary) {
    return json({ error: "Gemini returned an empty response" }, 502);
  }
  return json({ summary });
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
