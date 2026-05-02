import { Link } from "react-router-dom";
import { timeAgo } from "../lib/timeAgo.js";

export default function PostCard({ post }) {
  return (
    <Link to={`/post/${post.id}`} className="card card--clickable">
      <p className="card__meta">Posted {timeAgo(post.created_at)}</p>
      <h2 className="card__title">{post.title}</h2>
      <p className="card__upvotes">{post.upvotes} upvotes</p>
    </Link>
  );
}
