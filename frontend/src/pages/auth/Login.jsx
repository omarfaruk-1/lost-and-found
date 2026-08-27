import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, MailCheck } from "lucide-react";
import { useState } from "react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../services/api";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResendMessage("");

    try {
      await login(form);

      navigate(
        location.state?.from || "/dashboard",
        { replace: true }
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!form.email.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      setResendMessage("");

      const { data } =
        await authApi.resendVerification(
          form.email.trim()
        );

      setResendMessage(
        data?.message ||
          "A new verification email has been sent. Please check your inbox."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to resend verification email."
      );
    } finally {
      setResendLoading(false);
    }
  };

  /*
   * Show resend option only when
   * backend says the email needs verification.
   */
  const needsVerification =
    error.toLowerCase().includes("verif");

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Icon */}
        <div className="auth-icon">
          <LogIn size={22} />
        </div>

        {/* Heading */}
        <div className="section-heading">
          <div className="eyebrow">
            WELCOME BACK
          </div>

          <h1>
            Sign in to FindBack
          </h1>

          <p>
            Continue managing your lost & found
            reports.
          </p>
        </div>

        {/* Login error */}
        {error && (
          <Alert>
            {error}
          </Alert>
        )}

        {/* Resend verification */}
        {needsVerification && (
          <div className="resend-verification-box">

            <div className="resend-verification-content">
              <MailCheck size={18} />

              <div>
                <strong>
                  Email not verified
                </strong>

                <p>
                  Verify your email before
                  signing in.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="resend-link"
              onClick={resendVerification}
              disabled={
                resendLoading ||
                !form.email.trim()
              }
            >
              {resendLoading
                ? "Sending..."
                : "Resend verification email"}
            </button>
          </div>
        )}

        {/* Resend success */}
        {resendMessage && (
          <Alert>
            {resendMessage}
          </Alert>
        )}

        {/* Login form */}
        <form
          className="form-stack"
          onSubmit={submit}
        >
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm({
                ...form,
                email: e.target.value,
              });

              setError("");
              setResendMessage("");
            }}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm({
                ...form,
                password: e.target.value,
              });

              setError("");
            }}
            placeholder="Enter your password"
            required
          />

          {/* Forgot password */}
          <div className="forgot-password-row">
            <Link
              to="/forgot-password"
              className="forgot-password-link"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="full"
          >
            Sign in
          </Button>
        </form>

        {/* Register */}
        <p className="auth-switch">
          New to FindBack?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}