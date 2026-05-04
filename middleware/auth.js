const jwt = require("jsonwebtoken");
const USER = require("../model/user");
const BUILDER = require("../model/builder");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "Fail", message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userVerify = await USER.findOne({ _id: decoded.id, isDeleted: false, status: "active" })
    if (!userVerify) {
      return res.status(401).json({ status: "Fail", message: "Invalid token, user deleted or inactive" });
    }

    const builderData = await BUILDER.findOne({ userId: userVerify._id });
    req.user = { 
      ...userVerify._doc, 
      ...builderData?._doc, 
      _id: userVerify._id,
      builderId: builderData?._id 
    };
    
    next();
  } catch (err) {
    res.status(401).json({ status: "Fail", message: "Invalid token" });
  }
}

module.exports = authMiddleware;
