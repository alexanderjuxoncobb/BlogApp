import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { jwtConfig } from "./jwt.js";
import prisma from "../utils/prisma.js";

// Configure local strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // If user not found or password is incorrect
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        // Return user if authentication is successful
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configure JWT strategy for token-based authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Find the user by ID from JWT payload
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Used to deserialize the user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
