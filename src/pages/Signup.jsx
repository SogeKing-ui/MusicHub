import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const data = await signUp(email, password);
      // Supabase may require email confirmation depending on project settings.
      if (data.session) {
        navigate("/", { replace: true });
      } else {
        setDone(true);
      }
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

  if (done) {
    return (
      <div className="page form-page">
        <div className="card form">
          <h2 className="form__heading">Check your email</h2>
          <p className="form__hint">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            finish creating your account.
          </p>
          <Link to="/login" className="button button--ghost">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page form-page">
      <form className="card form" onSubmit={onSubmit}>
        <h2 className="form__heading">Create account</h2>
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
          placeholder="Password (min 6 chars)"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form__error">{error}</p>}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Sign up"}
        </button>

        <button
          type="button"
          className="button button--ghost"
          onClick={onGoogle}
        >
          Continue with Google
        </button>

        <div className="form__footer">
          <span>Already have an account?</span>
          <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
}
