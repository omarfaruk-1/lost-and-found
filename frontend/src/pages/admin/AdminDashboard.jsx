import { AlertTriangle, Ban, CheckCircle2, FileCheck2, PackageSearch, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../../services/api";
import StatCard from "../../components/dashboard/StatCard";
import Spinner from "../../components/ui/Spinner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { adminApi.dashboard().then(({data}) => setStats(data)); }, []);

  if (!stats) return <Spinner label="Loading admin dashboard..." />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><div><div className="eyebrow">ADMIN</div><h1>Platform overview</h1><p>Monitor users, reports, claims, and resolutions.</p></div><div className="admin-chip"><ShieldCheck size={16}/> Admin access</div></div>
        <div className="stats-grid stats-grid-large">
          <StatCard label="Total users" value={stats.totalUser} icon={Users}/>
          <StatCard label="Verified users" value={stats.totalVerifiedUser} icon={CheckCircle2}/>
          <StatCard label="Lost reports" value={stats.totalLost} icon={PackageSearch}/>
          <StatCard label="Found reports" value={stats.totalFound} icon={FileCheck2}/>
          <StatCard label="Resolved" value={stats.totalResolved} icon={CheckCircle2}/>
          <StatCard label="Total claims" value={stats.totalClaims} icon={FileCheck2}/>
          <StatCard label="Pending claims" value={stats.totalPending} icon={AlertTriangle}/>
          <StatCard label="Blocked users" value={stats.totalBlockUser} icon={Ban}/>
        </div>
        <div className="admin-panels">
          <div className="panel"><h2>Claims</h2><div className="metric-list"><span>Approved <b>{stats.totalApproved}</b></span><span>Pending <b>{stats.totalPending}</b></span><span>Rejected <b>{stats.totalRejected}</b></span></div></div>
          <div className="panel"><h2>Verification</h2><div className="metric-list"><span>Verified <b>{stats.totalVerifiedUser}</b></span><span>Unverified <b>{stats.totalUnverifiedUser}</b></span></div></div>
        </div>
      </div>
    </div>
  );
}