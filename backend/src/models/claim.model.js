import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "items",
      required: true,
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 20,
      maxLength: 1000,
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
            trim: true,
          },
          fileId: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
      validate: {
        validator: (images) => images.length > 0,
        message: "At least one image is required.",
      },
    },
    claimStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewReason: {
      type: String,
      enum: ["verified", "insufficient_proof", "wrong_item", "false_claim"],
    },
  },
  {
    timestamps: true,
  },
);

const claimModel = mongoose.model("Claim", claimSchema);

export default claimModel;
