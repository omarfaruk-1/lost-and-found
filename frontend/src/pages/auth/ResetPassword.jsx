import { LockKeyhole } from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useState } from "react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

import { authApi } from "../../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Token comes from:
  // /reset-password?token=xxxxx
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    // Check reset token
    if (!token) {
      setError(
        "Password reset link is invalid or missing."
      );
      return;
    }

    // Check password
    if (!form.password) {
      setError("Please enter your new password.");
      return;
    }

    // Minimum password length
    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    // Confirm password
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await authApi.resetPassword({
        token,
        password: form.password,
      });

      // Password reset successful
      navigate("/login", {
        replace: true,
        state: {
          message:
            data?.message ||
            "Password reset successfully. Please login.",
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to reset password. The reset link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Icon */}
        <div className="auth-icon">
          <LockKeyhole size={22} />
        </div>

        {/* Heading */}
        <div className="section-heading">
          <div className="eyebrow">
            PASSWORD RESET
          </div>

          <h1>Reset your password</h1>

          <p>
            Create a new password for your
            FindBack account.
          </p>
        </div>

        {/* Error */}
        {error && <Alert>{error}</Alert>}

        {/* Form */}
        <form
          className="form-stack"
          onSubmit={submit}
        >
          <Input
            label="New password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm({
                ...form,
                password: e.target.value,
              });

              setError("");
            }}
            placeholder="Enter new password"
            required
          />

          <Input
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => {
              setForm({
                ...form,
                confirmPassword: e.target.value,
              });

              setError("");
            }}
            placeholder="Confirm new password"
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="full"
          >
            Reset password
          </Button>
        </form>

        {/* Login link */}
        <p className="auth-switch">
          Remember your password?{" "}
          <Link to="/login">
            Back to login
          </Link>
        </p>

      </div>
    </div>
  );
}