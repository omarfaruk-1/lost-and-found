function errorHandler(error,req,res,next){
    console.log(error);
    return res.status(error.statusCode||500).json({
        message:error.message || "Internal server error"
    })
}

export default errorHandler;