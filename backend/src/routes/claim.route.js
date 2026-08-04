import {Router} from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import claimController from '../controllers/claim.controller.js';
const claimRoute = Router();

/**
 * create claim method-post: localhost:5000/api/claim
 */
claimRoute.post('/',authMiddleware, claimController.createClaim);

/**
 * get all claim method-get: localhost:5000/api/claim
 */
claimRoute.get('/',authMiddleware, claimController.getAllClaim);
/**
 * get claim by id method-get: localhost:5000/api/claim/:id
 */
claimRoute.get('/:id',authMiddleware, claimController.getClaimById);
/**
 * get my claim method-get: localhost:5000/api/claim/my-claims
 */
claimRoute.get('/my-claims',authMiddleware, claimController.myClaims);
/**
 * update claim method-patch: localhost:5000/api/claim/:id
 */
claimRoute.patch('/:id',authMiddleware, claimController.updateClaimStatus);


export default claimRoute;