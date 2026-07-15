async function authorization(req,res,next){
    try {
        if(req.user.role!=="role") return next(new appError("You can not access",403));
        next();
    } catch (error) {
        next(error)
    }
}

export default authorization;