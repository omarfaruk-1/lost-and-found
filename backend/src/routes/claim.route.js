import {Router} from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import claimController from '../controllers/claim.controller.js';
import uploadImageItem from '../middlewares/upload.middleware.js';
const claimRoute = Router();


/**
 * get all claim method-get: localhost:5000/api/claim
 */
claimRoute.get('/',authMiddleware, claimController.getAllClaim); //done

/**
 * get my claim method-get: localhost:5000/api/claim/my-claims
 */
claimRoute.get('/my-claims',authMiddleware, claimController.myClaims); //done

/**
 * create claim method-post: localhost:5000/api/claim
 */
claimRoute.post('/:itemId',authMiddleware,uploadImageItem, claimController.createClaim);//done



/**
 * get claim by id method-get: localhost:5000/api/claim/:itemId
 */
claimRoute.get('/:itemId',authMiddleware, claimController.getClaimById); // done

/**
 * update claim method-patch: localhost:5000/api/claim/:id
 */
claimRoute.patch('/:itemId',authMiddleware, claimController.updateClaimStatus); //done


export default claimRoute;