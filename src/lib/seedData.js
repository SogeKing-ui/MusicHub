// Local seed data — used until Supabase is wired up.
// Each post has the same shape we'll use in the database.

export const seedPosts = [
  {
    id: "p1",
    title: "What's the best album of all time?",
    content:
      "Mine has to be Kid A by Radiohead. Curious to hear yours and why.",
    image_url: null,
    upvotes: 14,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
  },
  {
    id: "p2",
    title: "Underrated Frank Ocean tracks?",
    content: "Looking for B-sides and lesser-known gems.",
    image_url: null,
    upvotes: 23,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "p3",
    title: "Is jazz making a comeback?",
    content: null,
    image_url: null,
    upvotes: 7,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "p4",
    title: "Concert recommendation: SZA on tour",
    content: "Just came back from Miami, easily top 3 shows of my life.",
    image_url: null,
    upvotes: 41,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
];

export const seedComments = {
  p1: [
    { id: "c1", post_id: "p1", body: "OK Computer > Kid A, fight me." },
    { id: "c2", post_id: "p1", body: "To Pimp a Butterfly belongs in the convo." },
  ],
  p2: [{ id: "c3", post_id: "p2", body: "Check out 'Provider', criminally slept on." }],
};
