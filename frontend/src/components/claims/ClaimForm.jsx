import { useState } from "react";
import { CATEGORIES } from "../../config";

import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import Select from "../ui/Select";
import ImageUploader from "../items/ImageUploader";

export default function ClaimForm({
  item,
  onSubmit,
  loading,
}) {
  const [category, setCategory] = useState(
    item?.category || "others"
  );

  const [description, setDescription] =
    useState("");

  const [files, setFiles] =
    useState([]);

  const [error, setError] =
    useState("");

  // =========================================
  // DETERMINE CLAIM PURPOSE FROM ITEM TYPE
  // =========================================

  const isLostPost = item?.type === "lost";

  // =========================================
  // SUBMIT CLAIM
  // =========================================

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    // Proof image required
    if (files.length === 0) {
      return setError(
        "Please add at least one photo to support your claim."
      );
    }

    // Minimum description
    if (description.trim().length < 20) {
      return setError(
        "Please provide at least 20 characters explaining your claim."
      );
    }

    try {
      const data = new FormData();

      // Claim category
      data.append(
        "category",
        category
      );

      // Claim explanation
      data.append(
        "description",
        description.trim()
      );

      // Claim proof images
      files.forEach((file) => {
        data.append("images", file);
      });

      await onSubmit(data);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to submit your claim. Please try again."
      );
    }
  };

  return (
    <form
      className="form-stack"
      onSubmit={submit}
    >

      {/* =====================================
          INTRO
      ===================================== */}

      <div className="section-heading">

        <div className="eyebrow">
          {isLostPost
            ? "FOUND ITEM"
            : "ITEM CLAIM"}
        </div>

        <h2>
          {isLostPost
            ? "I found this item"
            : "I believe this item is mine"}
        </h2>

        <p>
          {isLostPost
            ? "Let the owner know that you found their lost item and provide details to help arrange its return."
            : "Provide details that can help verify that this item belongs to you."}
        </p>

      </div>

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <Alert>
          {error}
        </Alert>
      )}

      {/* =====================================
          CATEGORY
      ===================================== */}

      <Select
        label="Item category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
        options={CATEGORIES}
      />

      {/* =====================================
          DESCRIPTION / PROOF
      ===================================== */}

      <Textarea
        label={
          isLostPost
            ? "Where did you find it?"
            : "Why do you believe this item is yours?"
        }
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        rows={7}
        placeholder={
          isLostPost
            ? "Tell the owner where and when you found this item. Include any details that may help confirm the item and arrange its return."
            : "Tell us why you believe this item belongs to you. Include specific details that can help verify your ownership."
        }
        required
      />

      {/* =====================================
          PROOF IMAGES
      ===================================== */}

      <ImageUploader
        files={files}
        setFiles={setFiles}
      />

      {/* =====================================
          SUBMIT
      ===================================== */}

      <Button
        type="submit"
        loading={loading}
      >
        {isLostPost
          ? "I Found This Item"
          : "Claim This Item"}
      </Button>

    </form>
  );
}