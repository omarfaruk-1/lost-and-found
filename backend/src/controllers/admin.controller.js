import userModel from "../models/user.model.js";
import itemModel from "../models/item.model.js";
import claimModel from "../models/claim.model.js";

async function admin(req,res,next){
    try{
        const allUser= await userModel.countDocuments();
        const verifiedUser= await userModel.countDocuments({isVerified:true});
        const unverifiedUser= await userModel.countDocuments({isVerified:false});
        const allFound= await itemModel.countDocuments({type:"found"});
        const allLost= await itemModel.countDocuments({type:"lost"});
        const totalResolved= await itemModel.countDocuments({status:"resolved"});
        const totalClaims= await claimModel.countDocuments();
        const totalApproved= await claimModel.countDocuments({claimStatus:"approved"});
        const totalRejected= await claimModel.countDocuments({claimStatus:"rejected"});
        const totalPending= await claimModel.countDocuments({claimStatus:"pending"});
        const totalBlockUser= await userModel.countDocuments({isBlocked:true});

        res.status(200).json({  
            totalUser:allUser,
            totalVerifiedUser:verifiedUser,
            totalUnverifiedUser:unverifiedUser,
            totalFound:allFound,
            totalLost:allLost,
            totalResolved:totalResolved,
            totalClaims:totalClaims,
            totalApproved:totalApproved,
            totalRejected:totalRejected,
            totalPending:totalPending,
            totalBlockUser:totalBlockUser
        })
    }catch(error){
        next(error)   
    }

}

export default {admin};