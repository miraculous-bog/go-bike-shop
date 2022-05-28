require('dotenv').config()

const AdminAuth = (req, res, next) => {
    next()
}

module.exports = {
    AdminAuth,
}