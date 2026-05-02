import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  // keep input in sync if user navigates via back/forward
  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  function onSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          MusicHub
        </Link>

        <form className="header__search" onSubmit={onSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search posts"
          />
        </form>

        <nav className="header__nav">
          <Link to="/">Home</Link>
          <Link to="/new">Create New Post</Link>
        </nav>
      </div>
    </header>
  );
}
