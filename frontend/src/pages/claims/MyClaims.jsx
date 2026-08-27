import { ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { claimApi } from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { formatDate } from "../../utils/format";
import { categoryLabel } from "../../config";

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    claimApi.mine().then(({data}) => setClaims(data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading claims..." />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><div><div className="eyebrow">CLAIMS</div><h1>My claims</h1><p>Track every claim you've submitted.</p></div></div>
        {claims.length === 0 ? <EmptyState title="No claims yet" description="When you find a report that may be yours, submit a claim from its detail page."/> : (
          <div className="claim-list">
            {claims.map(claim => (
              <Link className="claim-row" to={`/claims/${claim._id}`} key={claim._id}>
                <div className="claim-thumb">{claim.item?.images?.[0]?.url ? <img src={claim.item.images[0].url} alt=""/> : <ClipboardCheck size={21}/>}</div>
                <div className="claim-main">
                  <b>{claim.item?.itemName || "Item"}</b>
                  <span>{categoryLabel(claim.item?.category)} · Submitted {formatDate(claim.createdAt)}</span>
                </div>
                <span className={`claim-status ${claim.claimStatus}`}>{claim.claimStatus}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}