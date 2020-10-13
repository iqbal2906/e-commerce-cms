const { User } = require('../models')
const { comparePass } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')

class UserController {
    static async login(req, res, next) {
        const loginData = {
            email: req.body.email,
            password: req.body.password
        }

        if (!loginData.email || !loginData.password) {
            return next({
                name: "BadRequest",
                message: "Must Enter Email and Password",
            });
        }

        const user = await User.findOne({
            where: {
                email: loginData.email
            }
        })

        try {
            if (!user) {
                return next({
                    name: "Unauthorized",
                    message: 'Wrong email/password'
                })
            } else if (!comparePass(loginData.password, user.password)) {
                return next({
                    name: "Unauthorized",
                    message: 'Wrong email/password'
                })
            } else {
                const access_token = signToken({ id: user.id, email: user.email, role: user.role })
                res.status(201).json({
                    access_token
                })
                req.headers = access_token
            }
        } catch (err) {
            return next({
                name: 'InternalServerError',
                message: err.message
            })
        }
    }
}

module.exports = UserController