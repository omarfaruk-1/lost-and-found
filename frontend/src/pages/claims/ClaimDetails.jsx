import { ArrowLeft, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { claimApi } from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import { formatDate } from "../../utils/format";
import { categoryLabel } from "../../config";

const statusIcon = { pending: Clock3, approved: CheckCircle2, rejected: XCircle };

export default function ClaimDetails() {
  const { claimId } = useParams();
  const [claim, setClaim] = useState(null);

  useEffect(() => { claimApi.get(claimId).then(({data}) => setClaim(data.data)); }, [claimId]);

  if (!claim) return <Spinner label="Loading claim..." />;
  const Icon = statusIcon[claim.claimStatus] || Clock3;

  return (
    <div className="page">
      <div className="container narrow-container">
        <Link to="/my-claims" className="back-link"><ArrowLeft size={16}/> Back to claims</Link>
        <div className="claim-detail-card">
          <div className={`claim-status-large ${claim.claimStatus}`}><Icon size={21}/><span>{claim.claimStatus}</span></div>
          <div className="eyebrow">{categoryLabel(claim.item?.category)}</div>
          <h1>{claim.item?.itemName || "Claim"}</h1>
          <p className="field-hint">Submitted {formatDate(claim.createdAt)}</p>
          <div className="detail-section"><h3>Your proof</h3><p>{claim.description}</p></div>
          {claim.reviewReason && <div className="detail-section"><h3>Review reason</h3><p>{claim.reviewReason.replaceAll("_", " ")}</p></div>}
          {claim.images?.length > 0 && <div className="preview-grid">{claim.images.map(img => <div className="preview" key={img.fileId}><img src={img.url} alt="Claim proof"/></div>)}</div>}
        </div>
      </div>
    </div>
  );
}