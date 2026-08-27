import { CheckCircle2, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Spinner from "../../components/ui/Spinner";
import { authApi } from "../../services/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage("Verification token is missing.");
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const response = await authApi.verifyEmail(token);

        console.log("VERIFY SUCCESS:", response.data);

        if (cancelled) return;

        setSuccess(true);
        setMessage(
          response.data?.message ||
            "Email verified successfully. Please login."
        );
        setLoading(false);
      } catch (error) {
        console.log("VERIFY ERROR:", error);

        if (cancelled) return;

        setSuccess(false);
        setMessage(
          error?.response?.data?.message ||
            "Verification failed."
        );
        setLoading(false);
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <Spinner label="Verifying your email..." />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div
          className={`auth-icon ${
            success ? "success-icon" : "error-icon"
          }`}
        >
          {success ? (
            <CheckCircle2 size={25} />
          ) : (
            <XCircle size={25} />
          )}
        </div>

        <h1>
          {success
            ? "Email verified"
            : "Verification failed"}
        </h1>

        <p>{message}</p>

        <Link
          className="btn btn-primary"
          to="/login"
        >
          Continue to login
        </Link>
      </div>
    </div>
  );
}