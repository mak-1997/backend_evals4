const jwt = require("jsonwebtoken");

const auth = (req,res,next) => {
    const token = req.headers.authorization;
    if(token){
        const decoded = jwt.verify(token,"mayank");
        // console.log(decoded);
            req.body.userId = decoded.userID;
            // console.log(req.body)
            next();
        
    }else{
        res.status(400).send({"msg":"Please Login first !!"});
    }
}

module.exports={auth};