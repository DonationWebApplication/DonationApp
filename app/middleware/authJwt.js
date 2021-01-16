const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const db = require('../models');
const USER = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    if(!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, authConfig.secret, (err, decode) => {
        if(err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }

        req.userId = decode.id;
        next();
    });
}

isAdmin = (req, res, next) => {
    USER.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for(let i = 0; i < roles.length; i++) {
                if(roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Admin Role!"
            });

            return;
        });
    });
}

isModerator = (req, res, next) => {
    USER.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for(let i = 0; i < roles.length; i++) {
                next();
                return;
            }

            res.status(403).send({
                message: "Require Moderator Role!"
            });

            return;
        });
    });
}

isAdminOrModerator = (req, res, next) => {
    USER.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for(let i = 0; i < roles.length; i++) {
                next();
                return;
            }

            res.status(403).send({
                message: "Require Admin or Moderator Role!"
            })

            return;
        });
    });
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isAdminOrModerator: isAdminOrModerator
};

module.exports = authJwt


