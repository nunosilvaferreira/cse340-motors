// utilities/authMiddleware.js
const jwt = require("jsonwebtoken")

/* Middleware to check JWT */
function checkJWT(req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = payload
    next()
  } catch (error) {
    console.error("JWT verification failed:", error)
    req.flash("notice", "Session expired. Please log in again.")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
}

module.exports = { checkJWT }
