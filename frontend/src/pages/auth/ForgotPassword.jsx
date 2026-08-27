import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

import { authApi } from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await authApi.forgotPassword(
        email.trim()
      );

      setMessage(
        data?.message ||
          "Password reset link has been sent to your email."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to send password reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/login" className="back-link">
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="auth-icon">
          <Mail size={22} />
        </div>

        <div className="section-heading">
          <div className="eyebrow">
            PASSWORD RECOVERY
          </div>

          <h1>Forgot your password?</h1>

          <p>
            Enter your email address and we'll send
            you a link to reset your password.
          </p>
        </div>

        {error && <Alert>{error}</Alert>}

        {message && <Alert>{message}</Alert>}

        <form
          className="form-stack"
          onSubmit={submit}
        >
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setMessage("");
            }}
            placeholder="you@example.com"
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="full"
          >
            Send reset link
          </Button>
        </form>

        <p className="auth-switch">
          Remember your password?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}