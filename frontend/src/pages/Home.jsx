import { ArrowRight, CheckCircle2, HeartHandshake, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


const steps = [
  { icon: Search, title: "Search", text: "Browse lost and found reports using category, type, and location." },
  { icon: ShieldCheck, title: "Verify", text: "Review photos and descriptions before starting a claim." },
  { icon: HeartHandshake, title: "Reconnect", text: "Submit proof and let the item owner review your claim." },
];

export default function Home() {
  const {isAuthenticated }=useAuth();
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="pill"><Sparkles size={14}/> Community-powered recovery</div>
            <h1>Lost something?<br/><span>Let's bring it back.</span></h1>
            <p>FindBack makes it simple to report lost or found belongings, discover matching posts, and reconnect items with their owners.</p>
            <div className="hero-actions">
              <Link to="/items" className="btn btn-primary btn-lg"><Search size={18}/> Browse reports</Link>
              {
                isAuthenticated? (
                  <Link to="/dashboard" className="btn btn-secondary btn-lg">
                    Go to dashboard <ArrowRight size={18} />
                  </Link>
                ):<Link to="/register" className="btn btn-secondary btn-lg">Join FindBack <ArrowRight size={18}/></Link>
              }
            </div>
            <div className="trust-row">
              <span><CheckCircle2 size={16}/> Photo-based reports</span>
              <span><CheckCircle2 size={16}/> Claim verification</span>
              <span><CheckCircle2 size={16}/> Secure sessions</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-main">
              <div className="hero-card-top"><span className="status-dot"/> Recent found item</div>
              <div className="mock-photo">📱</div>
              <div className="mock-title">Black smartphone</div>
              <div className="mock-meta">Dhanmondi · Found yesterday</div>
              <div className="mock-line"><span>Found</span><span>Claim available</span></div>
            </div>
            <div className="float-card float-one"><span className="float-icon">✓</span><div><b>Claim verified</b><small>Owner approved</small></div></div>
            <div className="float-card float-two"><span className="float-icon">↗</span><div><b>12 new reports</b><small>This week</small></div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading centered">
            <div className="eyebrow">HOW IT WORKS</div>
            <h2>A better way to find what matters.</h2>
            <p>Everything you need to move from “lost” to “found” without the chaos.</p>
          </div>
          <div className="steps-grid">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <div className="step-card" key={title}>
                <div className="step-number">0{index + 1}</div>
                <div className="step-icon"><Icon size={21}/></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}