import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Reached via the link Supabase emails out for password recovery.
// At that point the user already has a recovery session, so we just
// need to collect a new password and call updateUser.
export default function UpdatePassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updatePassword(password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="page form-page">
      <form className="card form" onSubmit={onSubmit}>
        <h2 className="form__heading">Choose a new password</h2>
        <input
          className="input"
          type="password"
          placeholder="New password (min 6 chars)"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form__error">{error}</p>}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
