import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ResetPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page form-page">
      <form className="card form" onSubmit={onSubmit}>
        <h2 className="form__heading">Reset your password</h2>
        {sent ? (
          <p className="form__hint">
            If <strong>{email}</strong> is on file, we just sent a reset link.
            Check your inbox.
          </p>
        ) : (
          <>
            <p className="form__hint">
              We'll email you a link to choose a new password.
            </p>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="form__error">{error}</p>}
            <button className="button" type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}
        <div className="form__footer">
          <Link to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
