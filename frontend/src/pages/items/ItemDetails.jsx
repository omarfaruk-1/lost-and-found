import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Edit3,
  MapPin,
  Phone,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  claimApi,
  itemApi,
} from "../../services/api";

import {
  categoryLabel,
  typeLabel,
} from "../../config";

import { formatDate } from "../../utils/format";

import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ClaimForm from "../../components/claims/ClaimForm";
import Alert from "../../components/ui/Alert";

import { useAuth } from "../../hooks/useAuth";

export default function ItemDetails() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [active, setActive] = useState(0);

  const [claimOpen, setClaimOpen] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  // Claim check loading
  const [claimChecking, setClaimChecking] = useState(true);

  // Whether current user already claimed this item
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  const [message, setMessage] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD ITEM
  // =========================================

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      setMessage("");

      try {
        const { data } = await itemApi.get(itemId);

        setItem(data.item);
      } catch (err) {
        setMessage(
          err?.response?.data?.message ||
            "Item not found."
        );
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

  // =========================================
  // CHECK ALREADY CLAIMED
  // =========================================

  useEffect(() => {
    const checkClaim = async () => {
      // If user is not logged in
      if (!user || !item) {
        setAlreadyClaimed(false);
        setClaimChecking(false);
        return;
      }

      // Item owner cannot claim own item
      const isItemOwner =
        String(user?.id) ===
        String(item?.postedBy);

      if (isItemOwner) {
        setAlreadyClaimed(false);
        setClaimChecking(false);
        return;
      }

      try {
        setClaimChecking(true);

        const { data } =
          await claimApi.mine();

        const myClaims =
          data?.data || [];

        const hasClaimed =
          myClaims.some((claim) => {
            const claimedItemId =
              typeof claim.item === "object"
                ? claim.item?._id
                : claim.item;

            return (
              String(claimedItemId) ===
              String(item._id)
            );
          });

        setAlreadyClaimed(hasClaimed);

      } catch (err) {
        // If checking fails, don't block the user
        setAlreadyClaimed(false);
      } finally {
        setClaimChecking(false);
      }
    };

    checkClaim();
  }, [user, item]);

  // =========================================
  // LOADING ITEM
  // =========================================

  if (loading && !item && !message) {
    return (
      <Spinner label="Loading item..." />
    );
  }

  // =========================================
  // ITEM NOT FOUND
  // =========================================

  if (!item) {
    return (
      <div className="page">
        <div className="container">
          <Alert>
            {message || "Item not found."}
          </Alert>
        </div>
      </div>
    );
  }

  // =========================================
  // ITEM DATA
  // =========================================

  const isOwner =
    String(user?.id) ===
    String(item.postedBy);

  const isLostPost =
    item.type === "lost";

  const image =
    item.images?.[active]?.url ||
    item.images?.[0]?.url;

  // =========================================
  // SUBMIT CLAIM
  // =========================================

  const submitClaim = async (formData) => {
    setClaimLoading(true);

    try {
      await claimApi.create(
        itemId,
        formData
      );

      setClaimOpen(false);

      // Immediately update UI
      setAlreadyClaimed(true);

      setMessage(
        isLostPost
          ? "Your found-item report has been submitted. The owner has been notified."
          : "Your ownership claim has been submitted. The item owner has been notified."
      );

    } finally {
      setClaimLoading(false);
    }
  };

  // =========================================
  // DELETE ITEM
  // =========================================

  const remove = async () => {
    try {
      await itemApi.remove(itemId);

      navigate("/my-items");
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
          "Unable to delete this report."
      );
    }
  };

  return (
    <div className="page">

      <div className="container narrow-container">

        {/* =====================================
            BACK LINK
        ===================================== */}

        <Link
          to="/items"
          className="back-link"
        >
          <ArrowLeft size={16} />
          Back to reports
        </Link>

        {/* =====================================
            MESSAGE
        ===================================== */}

        {message && (
          <Alert type="success">
            {message}
          </Alert>
        )}

        {/* =====================================
            DETAILS
        ===================================== */}

        <div className="details-layout">

          {/* ===================================
              GALLERY
          =================================== */}

          <div>

            <div className="gallery-main">

              {image ? (
                <img
                  src={image}
                  alt={item.itemName}
                />
              ) : (
                <div className="image-placeholder large">
                  No image
                </div>
              )}

              <span
                className={`status-badge ${item.type}`}
              >
                {typeLabel(item.type)}
              </span>

              {item.status ===
                "resolved" && (
                <span className="resolved-badge">
                  Resolved
                </span>
              )}

            </div>

            {/* Gallery thumbnails */}

            {item.images?.length > 1 && (
              <div className="gallery-thumbs">

                {item.images.map(
                  (img, i) => (
                    <button
                      type="button"
                      className={
                        active === i
                          ? "thumb active"
                          : "thumb"
                      }
                      key={img.fileId}
                      onClick={() =>
                        setActive(i)
                      }
                    >
                      <img
                        src={img.url}
                        alt=""
                      />
                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* ===================================
              ITEM INFORMATION
          =================================== */}

          <div className="details-copy">

            <div className="eyebrow">
              {categoryLabel(
                item.category
              )}
            </div>

            <h1>
              {item.itemName}
            </h1>

            <p className="details-description">
              {item.description}
            </p>

            {/* Item details */}

            <div className="detail-list">

              <div>
                <MapPin size={18} />

                <span>
                  <b>Location</b>
                  {item.location}
                </span>
              </div>

              <div>
                <CalendarDays size={18} />

                <span>
                  <b>Date</b>
                  {formatDate(item.date)}
                </span>
              </div>

              <div>
                <Phone size={18} />

                <span>
                  <b>Contact</b>
                  {item.contact}
                </span>
              </div>

            </div>

            {/* =================================
                CLAIM ACTION
            ================================= */}

            {item.status !== "resolved" &&
              !isOwner &&
              user && (

              claimChecking ? (

                // Don't show claim button
                // until claim status is checked
                <div className="claim-checking">
                  Checking claim status...
                </div>

              ) : alreadyClaimed ? (

                // Already claimed
                <div className="already-claimed">

                  <CheckCircle2 size={19} />

                  <div>

                    <strong>
                      You've already claimed this item
                    </strong>

                    <span>
                      Your claim has already
                      been submitted for this
                      report.
                    </span>

                  </div>

                </div>

              ) : (

                // Can claim
                <Button
                  className="full"
                  onClick={() =>
                    setClaimOpen(true)
                  }
                >

                  <CheckCircle2 size={17} />

                  {isLostPost
                    ? "I Found This Item"
                    : "I Believe This Is Mine"}

                </Button>

              )
            )}

            {/* =================================
                NOT LOGGED IN
            ================================= */}

            {!user &&
              item.status !== "resolved" && (

              <Link
                className="btn btn-primary full"
                to="/login"
              >
                Sign in to make a claim
              </Link>

            )}

            {/* =================================
                OWNER ACTIONS
            ================================= */}

            {isOwner && (

              <div className="owner-actions">

                <Link
                  className="btn btn-secondary"
                  to={`/items/${itemId}/edit`}
                >
                  <Edit3 size={16} />
                  Edit
                </Link>

                <Button
                  variant="danger"
                  onClick={() =>
                    setDeleteOpen(true)
                  }
                >
                  <Trash2 size={16} />
                  Delete
                </Button>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =======================================
          CLAIM MODAL
      ======================================= */}

      <Modal
        open={claimOpen}
        title={
          isLostPost
            ? "I Found This Item"
            : "I Believe This Is Mine"
        }
        onClose={() =>
          setClaimOpen(false)
        }
      >

        <p className="modal-intro">

          {isLostPost ? (
            <>
              Tell the owner where you
              found{" "}
              <b>{item.itemName}</b>{" "}
              and provide details that
              can help arrange its return.
            </>
          ) : (
            <>
              Provide details and proof
              to help verify that{" "}
              <b>{item.itemName}</b>{" "}
              belongs to you.
            </>
          )}

        </p>

        <ClaimForm
          item={item}
          onSubmit={submitClaim}
          loading={claimLoading}
        />

      </Modal>

      {/* =======================================
          DELETE MODAL
      ======================================= */}

      <Modal
        open={deleteOpen}
        title="Delete this report?"
        onClose={() =>
          setDeleteOpen(false)
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                setDeleteOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={remove}
            >
              Delete report
            </Button>
          </>
        }
      >

        <p>
          This action cannot be undone.
        </p>

      </Modal>

    </div>
  );
}