const Permissions = require("../models/permissions.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// configuration file
dotenv.config();

exports.checkPermission = (role, permission) => {
  return (req, res, next) => {
    const userPermissions = new Permissions().getPermissionsByRoleName(role);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      return res.status(403).json({ error: "Access Denied" });
    }
  };
};

exports.checkRole = (role) => {
  return (req, res, next) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    jwt.verify(req.token, jwtSecretKey, (err, autoData) => {
      if (err) res.status(403).json({ message: "Role not allowed" });
      else {
        const userRole = autoData ? autoData.roleName : "anonymous";
        if (userRole.includes(role)) {
          return next();
        } else {
          return res
            .status(403)
            .json({ error: "Access Denied because of the Role" });
        }
      }
    });
  };
};
