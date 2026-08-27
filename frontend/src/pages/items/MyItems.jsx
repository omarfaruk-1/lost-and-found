import {
  CheckCircle2,
  ClipboardCheck,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { itemApi, claimApi } from "../../services/api";
import ItemCard from "../../components/items/ItemCard";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";
import { formatDate } from "../../utils/format";

const reviewReasons = [
  {
    value: "insufficient_proof",
    label: "Insufficient proof",
  },
  {
    value: "wrong_item",
    label: "Wrong item",
  },
  {
    value: "false_claim",
    label: "False claim",
  },
];

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState({});
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");

  const [rejectModal, setRejectModal] = useState({
    open: false,
    claim: null,
  });

  const [rejectReason, setRejectReason] = useState("");

  // =========================
  // LOAD MY ITEMS + CLAIMS
  // =========================

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await itemApi.mine(
        q ? { itemName: q } : {}
      );

      const myItems = data.items || [];

      setItems(myItems);

      // Get claims for every item
      const claimResults = await Promise.all(
        myItems.map(async (item) => {
          try {
            const { data } = await claimApi.list({
              item: item._id,
            });

            return {
              itemId: item._id,
              claims: data.data || [],
            };
          } catch {
            return {
              itemId: item._id,
              claims: [],
            };
          }
        })
      );

      const claimMap = {};

      claimResults.forEach(
        ({ itemId, claims }) => {
          claimMap[itemId] = claims;
        }
      );

      setClaims(claimMap);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load your reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // APPROVE CLAIM
  // =========================

  const approveClaim = async (claimId) => {
    try {
      setActionLoading(true);
      setError("");

      await claimApi.updateStatus(
        claimId,
        {
          claimStatus: "approved",
        }
      );

      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to approve this claim."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // OPEN REJECT MODAL
  // =========================

  const openRejectModal = (claim) => {
    setRejectReason("");

    setRejectModal({
      open: true,
      claim,
    });
  };

  // =========================
  // CLOSE REJECT MODAL
  // =========================

  const closeRejectModal = () => {
    if (actionLoading) return;

    setRejectModal({
      open: false,
      claim: null,
    });

    setRejectReason("");
  };

  // =========================
  // REJECT CLAIM
  // =========================

  const rejectClaim = async () => {
    if (!rejectModal.claim) return;

    if (!rejectReason) {
      setError(
        "Please select a rejection reason."
      );
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await claimApi.updateStatus(
        rejectModal.claim._id,
        {
          claimStatus: "rejected",
          reviewReason: rejectReason,
        }
      );

      setRejectModal({
        open: false,
        claim: null,
      });

      setRejectReason("");

      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to reject this claim."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">
          <div>
            <div className="eyebrow">
              YOUR REPORTS
            </div>

            <h1>My posted items</h1>

            <p>
              Keep your lost and found reports
              up to date.
            </p>
          </div>

          <Link
            className="btn btn-primary"
            to="/items/new"
          >
            <Plus size={17} />
            Post item
          </Link>
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="toolbar">
          <Input
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
            placeholder="Search my reports..."
          />

          <Button
            variant="secondary"
            onClick={load}
          >
            <Search size={16} />
            Search
          </Button>
        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <Alert>
            {error}
          </Alert>
        )}

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (
          <Spinner label="Loading your reports..." />
        ) : items.length ? (

          <div className="my-items-list">

            {items.map((item) => {

              const itemClaims =
                claims[item._id] || [];

              return (
                <div
                  className="my-item-block"
                  key={item._id}
                >

                  {/* =========================
                      ITEM CARD
                  ========================= */}

                  <ItemCard item={item} />

                  {/* =========================
                      CLAIMS RECEIVED
                  ========================= */}

                  <div className="claims-received">

                    <div className="claims-received-header">

                      <div>
                        <div className="eyebrow">
                          CLAIMS RECEIVED
                        </div>

                        <h3>
                          Claims for this item
                        </h3>

                        <p>
                          Review claims submitted
                          for your report.
                        </p>
                      </div>

                      {/* ONLY NUMBER */}
                      <span className="claim-count">
                        {itemClaims.length}
                      </span>

                    </div>

                    {/* =========================
                        NO CLAIM
                    ========================= */}

                    {itemClaims.length === 0 ? (

                      <div className="claims-empty">
                        <ClipboardCheck
                          size={18}
                        />

                        <span>
                          No claims received yet.
                        </span>
                      </div>

                    ) : (

                      <div className="received-claims-list">

                        {itemClaims.map(
                          (claim) => (

                            <div
                              className="received-claim"
                              key={claim._id}
                            >

                              {/* =========================
                                  CLAIM HEADER
                              ========================= */}

                              <div className="received-claim-header">

                                <div>
                                  <strong>
                                    Claim submitted
                                  </strong>

                                  <span>
                                    Submitted{" "}
                                    {formatDate(
                                      claim.createdAt
                                    )}
                                  </span>
                                </div>

                                <span
                                  className={`claim-status ${claim.claimStatus}`}
                                >
                                  {claim.claimStatus}
                                </span>

                              </div>

                              {/* =========================
                                  CLAIM PROOF
                              ========================= */}

                              <div className="received-claim-proof">

                                <h4>
                                  Claimant's proof
                                </h4>

                                <p>
                                  {claim.description ||
                                    "No description provided."}
                                </p>

                              </div>

                              {/* =========================
                                  CLAIM PROOF IMAGES
                                  NO DUPLICATE THUMBNAIL
                              ========================= */}

                              {claim.images?.length > 0 && (

                                <div className="preview-grid">

                                  {claim.images.map(
                                    (image) => (

                                      <div
                                        className="preview"
                                        key={
                                          image.fileId
                                        }
                                      >

                                        <img
                                          src={
                                            image.url
                                          }
                                          alt="Claim proof"
                                        />

                                      </div>

                                    )
                                  )}

                                </div>

                              )}

                              {/* =========================
                                  APPROVE / REJECT
                              ========================= */}

                              {claim.claimStatus ===
                                "pending" && (

                                <div className="owner-actions">

                                  <Button
                                    variant="primary"
                                    disabled={
                                      actionLoading
                                    }
                                    loading={
                                      actionLoading
                                    }
                                    onClick={() =>
                                      approveClaim(
                                        claim._id
                                      )
                                    }
                                  >

                                    <CheckCircle2
                                      size={16}
                                    />

                                    Approve

                                  </Button>

                                  <Button
                                    variant="secondary"
                                    disabled={
                                      actionLoading
                                    }
                                    onClick={() =>
                                      openRejectModal(
                                        claim
                                      )
                                    }
                                  >

                                    <X size={16} />

                                    Reject

                                  </Button>

                                </div>

                              )}

                              {/* =========================
                                  REVIEW REASON
                              ========================= */}

                              {claim.reviewReason && (

                                <div className="detail-section">

                                  <h3>
                                    Review reason
                                  </h3>

                                  <p>
                                    {claim.reviewReason.replaceAll(
                                      "_",
                                      " "
                                    )}
                                  </p>

                                </div>

                              )}

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          /* =========================
             EMPTY
          ========================= */

          <EmptyState
            title="You haven't posted anything"
            description="Create a lost or found report to get started."
            action={
              <Link
                className="btn btn-primary"
                to="/items/new"
              >
                Post your first item
              </Link>
            }
          />

        )}

      </div>

      {/* =========================
          REJECT MODAL
      ========================= */}

      {rejectModal.open && (

        <div
          className="modal-backdrop"
          onClick={closeRejectModal}
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="modal-header">

              <h3>
                Reject claim
              </h3>

              <button
                className="icon-btn"
                onClick={closeRejectModal}
                disabled={actionLoading}
                aria-label="Close"
              >
                <X size={18} />
              </button>

            </div>

            {/* Modal Body */}

            <div className="modal-body">

              <p className="modal-intro">
                Select a reason for rejecting
                this claim.
              </p>

              <div className="form-stack">

                {reviewReasons.map(
                  (reason) => (

                    <label
                      key={reason.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        cursor: "pointer",
                        fontSize: ".85rem",
                        color: "#334155",
                      }}
                    >

                      <input
                        type="radio"
                        name="reviewReason"
                        value={reason.value}
                        checked={
                          rejectReason ===
                          reason.value
                        }
                        onChange={(e) =>
                          setRejectReason(
                            e.target.value
                          )
                        }
                      />

                      {reason.label}

                    </label>

                  )
                )}

              </div>

            </div>

            {/* Modal Footer */}

            <div className="modal-footer">

              <Button
                variant="secondary"
                onClick={closeRejectModal}
                disabled={actionLoading}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                onClick={rejectClaim}
                loading={actionLoading}
                disabled={!rejectReason}
              >
                Reject claim
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}