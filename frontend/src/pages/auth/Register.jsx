import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    
    e.preventDefault();
    setLoading(true); 
    setError(""); 
    setSuccess("");

    try {
      const data = await register(form);
      setSuccess(data.message || "Account created. Check your email to verify it.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create account.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon"><UserPlus size={22}/></div>
        <div className="section-heading">
          <div className="eyebrow">GET STARTED</div>
          <h1>Create your account</h1>
          <p>Join the community helping belongings find their way home.</p>
        </div>
        {error && <Alert>{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}
        <form className="form-stack" onSubmit={submit}>
          <Input label="Username" value={form.username} onChange={(e) => setForm({...form, username:e.target.value})} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({...form, password:e.target.value})} hint="Use a strong password you don't reuse elsewhere." required />
          <Button type="submit" loading={loading} className="full">Create account</Button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}