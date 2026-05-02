import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  async function onGoogle() {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page form-page">
      <form className="card form" onSubmit={onSubmit}>
        <h2 className="form__heading">Log in</h2>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form__error">{error}</p>}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </button>

        <button
          type="button"
          className="button button--ghost"
          onClick={onGoogle}
        >
          Continue with Google
        </button>

        <div className="form__footer">
          <Link to="/reset-password">Forgot password?</Link>
          <span>·</span>
          <Link to="/signup">Create account</Link>
        </div>
      </form>
    </div>
  );
}
