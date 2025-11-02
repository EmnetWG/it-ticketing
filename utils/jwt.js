const jwt = require('jsonwebtoken')

// createJWT = ({payload}) => {
// token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"30d"} )
//return token
// }


const createJWT = ({ payload }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object');
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
  return token;
};

// const isValidToken = ({token}) => {
 //   const isMatch = jwt.verify(token, process.env.JWT_SECRET)
//    return isMatch
// }

const isValidToken = ({ token }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // returns the decoded payload
  } catch (err) {
    return null; // or false if you prefer
  }
};

module.exports = {
    createJWT,
    isValidToken
}