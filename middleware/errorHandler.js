
export const errorHandler = (err,req,res,next)=>{
    const responseStatusCode = res.statusCode ? res.statusCode : 500
    
    res.status(responseStatusCode)

    res.json({
        message: err.message,
        stack:process.env.NODE_ENV === "production" ? null : err.stack
    })
}