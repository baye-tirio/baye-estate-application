import { manualError } from "./error.mjs";
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    // console.log('The request object is as follows let\'s see if we can find the cookie');
    // console.log(req);
  const token = req.cookies.access_token;
  if (!token) next(manualError(401, "Unauthorized Access !"));
  else {
    jwt.verify(token, process.env.JWT_SECRET, (error, validToken) => {
      if (error) next(manualError(403, "Forbidden !"));
      else {
        req.userToken = validToken;
        next();
      }
    });
  }
}
