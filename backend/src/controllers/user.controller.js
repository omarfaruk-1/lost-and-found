import itemModel from "../models/item.model.js";
import claimModel from "../models/claim.model.js";

async function dashboard(req, res, next) {
  try {
    const userId = req.user._id;

    const [totalReports, totalClaims, totalResolved] =
      await Promise.all([
        itemModel.countDocuments({
          postedBy: userId,
        }),

        claimModel.countDocuments({
          claimedBy: userId,
        }),

        itemModel.countDocuments({
          postedBy: userId,
          status: "resolved",
        }),
      ]);

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      data: {
        reports: totalReports,
        claims: totalClaims,
        resolved: totalResolved,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  dashboard,
};
