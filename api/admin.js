const axios = require('axios')
require('dotenv').config()
const { HOST } = process.env

const auth = async (token) => {
    const res = await axios.post(`${HOST}/admin/auth`, {
        token
    })
}

module.exports = {
    auth,
}