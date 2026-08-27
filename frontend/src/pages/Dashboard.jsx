import { useCallback, useEffect, useState } from "react";
import {
  ClipboardCheck,
  FileSearch,
  PackageCheck,
  Plus,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import StatCard from "../components/dashboard/StatCard";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";

import { useAuth } from "../hooks/useAuth";
import { useAsync } from "../hooks/useAsync";
import { dashboardApi } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    reports: 0,
    claims: 0,
    resolved: 0,
  });

  const loadDashboard = useCallback(() => {
    return dashboardApi.getStats();
  }, []);

  const {
    execute,
    loading,
    error,
  } = useAsync(loadDashboard);

  useEffect(() => {
    execute()
      .then((response) => {
        setStats(response.data.data);
      })
      .catch(() => {});
  }, [execute]);

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <div>
            <div className="eyebrow">
              YOUR WORKSPACE
            </div>

            <h1>
              Welcome back, {user?.username}.
            </h1>

            <p>
              Manage your reports, claims,
              and recovery journey.
            </p>
          </div>

          <Link
            to="/items/new"
            className="btn btn-primary"
          >
            <Plus size={17} />
            Post an item
          </Link>
        </div>

        {/* Error */}
        {error && (
          <Alert>
            {error}
          </Alert>
        )}

        {/* Statistics */}
        {loading ? (
          <Spinner label="Loading dashboard..." />
        ) : (
          <div className="stats-grid">

            <StatCard
              label="My reports"
              value={stats.reports}
              icon={FileSearch}
            />

            <StatCard
              label="My claims"
              value={stats.claims}
              icon={ClipboardCheck}
            />

            <StatCard
              label="Resolved"
              value={stats.resolved}
              icon={PackageCheck}
            />

          </div>
        )}

        {/* Quick Actions */}
        <div className="dashboard-grid">
          <div className="panel">

            <div className="panel-header">
              <div>
                <h2>Quick actions</h2>

                <p>
                  Jump into the most common tasks.
                </p>
              </div>
            </div>

            <div className="quick-grid">

              <Link
                to="/items"
                className="quick-card"
              >
                <Search size={20} />

                <b>
                  Browse reports
                </b>

                <span>
                  Find a lost or found item
                </span>
              </Link>

              <Link
                to="/items/new"
                className="quick-card"
              >
                <Plus size={20} />

                <b>
                  Post a report
                </b>

                <span>
                  Tell the community about an item
                </span>
              </Link>

              <Link
                to="/my-items"
                className="quick-card"
              >
                <FileSearch size={20} />

                <b>
                  My posts
                </b>

                <span>
                  Edit or manage your reports
                </span>
              </Link>

              <Link
                to="/my-claims"
                className="quick-card"
              >
                <ClipboardCheck size={20} />

                <b>
                  My claims
                </b>

                <span>
                  Track your submitted claims
                </span>
              </Link>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}