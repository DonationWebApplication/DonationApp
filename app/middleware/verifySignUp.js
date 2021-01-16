const db = require('../models');
const ROLES = db.Roles;
const USER = db.user;

checkDuplicateUserNameOrEmail = (req, res, next) => {
    USER.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if(user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }

        USER.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if(user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                });
                return;
            }
            next();
        })
    })
}

checkRoleExited = (req, res, next) => {
    if(req.body.roles) {
        for(let i = 0; i < req.body.roles.length; i++) {
            if(!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + req.body.roles[i]
                });

                return;
            }
        }
    }
    next();
}

const verifySignUp = {
    checkDuplicateUserNameOrEmail: checkDuplicateUserNameOrEmail,
    checkRoleExited: checkRoleExited
}

module.exports = verifySignUp;