import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  // CHANGED: robust header parsing + cookie fallback
  const rawAuth = req.headers.authorization || req.get("authorization") || "";
  const match = rawAuth.match(/^Bearer\s+(.+)$/i);
  const tokenFromHeader = match?.[1]?.trim();
  const token = tokenFromHeader || (req.cookies ? req.cookies.accessToken : undefined);

  if (!token) {
    throw new ApiError(401, "Unauthorized: access token missing");
  }

  try {
    // CHANGED: guard missing secret, support multiple id fields
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new ApiError(500, "JWT access secret not configured");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userId = decodedToken.id || decodedToken._id || decodedToken.sub || decodedToken.userId;

    if (!userId) {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    return next();
  } catch (err) {
    // CHANGED: persistence fallback using refresh token from cookies
    const refreshToken = req.cookies && req.cookies.refreshToken;
    if (refreshToken && process.env.JWT_REFRESH_SECRET && process.env.JWT_ACCESS_SECRET) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const refreshUserId =
          decodedRefresh.id || decodedRefresh._id || decodedRefresh.sub || decodedRefresh.userId;

        if (refreshUserId) {
          const user = await User.findById(refreshUserId);
          if (user) {
            const newAccessToken = jwt.sign(
              { id: user._id },
              process.env.JWT_ACCESS_SECRET,
              { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
            );
            // Make the new token available to the controller/route to set cookie/header
            res.locals.accessToken = newAccessToken;
            req.user = user;
            return next();
          }
        }
      } catch {
        // ignore refresh failure and fall through to 401
      }
    }

    throw new ApiError(401, "Invalid or expired token");
  }
});
