const jwt = require('jsonwebtoken');

//Check Auth Function
module.exports = (req,res,next) => {
    try {
        //We will authenticate by sending the token in the header
        //As "Bearer {token}"
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
       //Remember instead of 'secret' we use ENV variable
        const decoded = jwt.verify(token, process.env.SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Authentication Failed"
        })
    }
}