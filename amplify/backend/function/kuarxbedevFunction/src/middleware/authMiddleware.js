/** @format */

let jwt = require("jsonwebtoken");
let asyncHandler = require("express-async-handler");
let User = require("../models/userModel.js");
const { getSecretValue } = require("../awsServices/awsMiscellaneous.js");
const { LogThis, LoggerSettings, L0, L3 } = require("../utils/Logger");
const srcFile = "authMiddleware.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const log = new LoggerSettings(srcFile, "protect");
  LogThis(log, `START`, L3);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      LogThis(
        log,
        `About to call getSecretValue process.env.JWT_SECRET_VAR=${process.env.JWT_SECRET_VAR}`,
        L3
      );
      const secretValue = await getSecretValue(process.env.JWT_SECRET_VAR);

      const decoded = jwt.verify(token, secretValue);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

module.exports = { protect, admin };
