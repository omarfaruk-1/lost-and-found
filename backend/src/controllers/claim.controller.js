import claimModel from "../models/claim.model.js";
import itemModel from "../models/item.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";
import storageService from "../services/storage.service.js";
import appError from "../errors/appError.js";
import claimApprovedTemplate from "../templates/claimApproved.template.js";
import claimTemplate from "../templates/claim.template.js";
import sendMail from "../services/mail.service.js";

async function createClaim(req, res, next) {
  try {
    const {itemId}=req.params;
    const {claimType, description } = req.body;
    const files = req.files;
    if ( !mongoose.isValidObjectId(itemId)) {
      return next(new appError ("Invalid itemId", 400));
    }
    if (!itemId || !claimType || !description || !files || files.length === 0) {
      return next(new appError ("Missing required fields", 400));
    }
    const item = await itemModel.findById(itemId);
    if (!item) {
      return next(new appError ("Item not found", 400));
    }
    if(item.status==="resolved") return next(new appError("This item already resolved, so you can not claim this item"))

    const existingClaim =await claimModel.findOne({item:itemId,claimedBy:req.user._id});
    if(existingClaim) return next(new appError("Already you claimed this item",400));

    if (!["phone", "bag", "document", "wallet", "electronics", "jewelry", "others"].includes(claimType)) {
      return next(new appError("Invalid claimType", 400));
    }

    const result = await Promise.all(files.map((file)=>storageService.uploadImage(file.buffer.toString("base64"),"claim")));
    const images = result.map((image)=>({url:image.url,fileId:image.fileId}));

    const claim= await claimModel.create({
        item:itemId,
        claimedBy:req.user._id,
        claimType,
        description,
        images,
    });

    const owner = await userModel.findById(item.postedBy);
    console.log(owner)
    
    const claimant = await userModel.findById(req.user._id);
    console.log(claim)
    await sendMail(owner.email,"New Claim Submitted",claimTemplate(owner.username,claimant.username,item.itemName));

    res.status(201).json({
        message:"Claim created successfully",
        data:claim
    });

  } catch (error) {
    next(error);
  }
}

async function getAllClaim(req, res, next) {
  try {
    const { claimedBy, claimStatus, item, page, limit } = req.query;

    const query = {};

    if (claimedBy) query.claimedBy = claimedBy;
    if (claimStatus) query.claimStatus = claimStatus;
    if (item) query.item = item;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Number(limit) || 10, 30);
    const skip = (pageNumber - 1) * limitNumber;

    const claims = await claimModel.find(query).populate("item").sort({ createdAt: -1 }).skip(skip).limit(limitNumber);

    const totalClaims = await claimModel.countDocuments(query);

    res.status(200).json({
      message: "Claims retrieved successfully",
      totalClaims,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalClaims / limitNumber),
      data: claims,
    });
  } catch (error) {
    next(error);
  }
}

async function getClaimById(req, res, next) {
  try {
    const { itemId } = req.params;
    if (!mongoose.isValidObjectId(itemId)) {
      return next(new appError("Invalid itemId", 400));
    }
    const claim = await claimModel.findById(itemId).populate("item");
    if (!claim) {
      return next(new appError("Claim not found", 404));
    }

    res.status(200).json({
      message: "Claim retrieved successfully",
      data: claim,
    });
  } catch (error) {
    next(error);
  }
}

async function myClaims(req, res, next) {
  try {
    console.log(req.user._id)
    const claims = await claimModel.find({ claimedBy: req.user._id }).populate("item").sort({ createdAt: -1 });

    res.status(200).json({
      message: "My claims retrieved successfully",
      data: claims,
    });
  } catch (error) {
    next(error);
  }
}

async function updateClaimStatus(req, res, next) {
  try {
    const { itemId } = req.params;
    const { claimStatus, reviewReason } = req.body;

    if (!mongoose.isValidObjectId(itemId)) {
      return next(new appError("Invalid itemId", 400));
    }

    if (!["approved", "rejected"].includes(claimStatus)) {
      return next(new appError("Invalid claim status", 400));
    }

    const claim = await claimModel.findById(itemId);

    if (!claim) {
      return next(new appError("Claim not found", 404));
    }

    if (claim.claimStatus !== "pending") {
      return next(new appError("Claim has already been reviewed", 400));
    }

    const item = await itemModel.findById(claim.item);

    if (!item) {
      return next(new appError("Item not found", 404));
    }

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new appError("You are not authorized to update this claim", 403));
    }

    if (claimStatus === "rejected" && !reviewReason?.trim()) {
      return next(new appError("Review reason is required", 400));
    }

    claim.claimStatus = claimStatus;
    if(claimStatus==="approved"){ item.status="resolved";}

    if (claimStatus === "rejected") {
      claim.reviewReason = reviewReason;

      if (reviewReason === "false_claim") {
        const user = await userModel.findById(claim.claimedBy);

        user.falseClaimCount += 1;

        if (user.falseClaimCount >= 5) {
          user.isBlocked = true;
        }

        await user.save();
      }
    }
    await claim.save();
    await item.save();

    if (claimStatus === "approved") {
      await claimModel.updateMany(
        {
          item: claim.item,
          claimStatus: "pending",
        },
        {
          $set: {
            claimStatus: "rejected",
            reviewReason: "Another claim has already been approved.",
          },
        }
      );

      const claimant = await userModel.findOne(claim.claimedBy);
      await sendMail(req.user.email,"Claim Approved",claimApprovedTemplate(claimant.username,item.itemName));
    }

    res.status(200).json({
      message: `Claim ${claimStatus} successfully`,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
}


export default {
  createClaim,
  getAllClaim,
  getClaimById,
  myClaims,
  updateClaimStatus,
};