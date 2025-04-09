import passport from "passport";

// Middleware to authenticate using JWT strategy
export const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Written with Gemini-2.5
// Middleware that tries to authenticate JWT, but doesn't fail if no token/invalid token
export const optionalAuthenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    // Handle potential errors from Passport
    if (err) {
      console.error("Optional Passport Authentication Error:", err);
      // Still pass critical errors along
      return next(err);
    }

    // If authentication was successful (user is truthy), attach user to request object
    if (user) {
      req.user = user;
    }
    // If authentication failed (user is falsy), req.user remains undefined

    // Always proceed to the next middleware/route handler,
    // regardless of authentication success or failure.
    next();
  })(req, res, next); // Invoke the Passport middleware
};

// Middleware to check if user is the author or has admin role
export const isAuthorized = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Authentication required",
    });
  }

  // Get resource ID and owner ID from route parameters or request body
  const resourceId = parseInt(req.params.id);
  const ownerId = req.body.authorId || req.params.authorId;

  // If the authenticated user is the owner or an admin, allow access
  if (req.user.id === ownerId) {
    return next();
  }

  // If not authorized, deny access
  return res.status(403).json({
    success: false,
    message: "Forbidden: You do not have permission to perform this action",
  });
};
