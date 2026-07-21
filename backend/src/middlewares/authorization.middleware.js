async function authorization(req,res,next){
    try {
        if(req.user.role!=="admin") return next(new appError("You can not access",403));
        next();
    } catch (error) {
        next(error)
    }
}

export default authorization;