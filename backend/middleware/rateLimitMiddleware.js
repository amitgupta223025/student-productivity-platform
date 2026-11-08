const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Maximum 10 requests
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many attempts. Please try again after 15 minutes.",
  },
});

module.exports = authLimiter;


//  What does this do?
// - Allows 10 requests within 15 minutes from the same IP.
// - After that, blocks further requests temporarily.
// - Applies to whichever routes we attach it to.