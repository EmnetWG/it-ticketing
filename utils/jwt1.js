const jwt = require('jsonwebtoken')

const createJWT = ({payload}) => {
const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"30d"} )
return token
}

const isValidToken = ({token}) => {
    const isMatch = jwt.verify(token, process.env.JWT_SECRET)
    return isMatch
}

module.exports = {
    createJWT,
    isValidToken
}