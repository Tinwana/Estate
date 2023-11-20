import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
export const authMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  const userId = req.headers.id;
  if (!userId) {
    return res.status(404).json({
      status: "error",
      message: "Id is required!",
    });
  }
  // if (req.params.userId && req.params.userId !== userId) {
  //   return res.status(404).json({
  //     status: "error",
  //     message: "The Authentication Id Error occurred!",
  //   });
  // }
  jwt.verify(token, process.env.JWT_SECRET, async function (err, user) {
    if (err) {
      return res.status(404).json({
        status: "error",
        message: "The Authentication Token Error occurred!",
      });
    } else {
      const { payload } = user;
      // const currentUser = await User.findById(payload?.id);
      if (payload?.id === userId) {
        // req.user = currentUser;
        next();
      } else {
        return res.status(404).json({
          status: "error",
          message: "The Authentication Catch Error occurred!",
        });
      }
    }
  });
};
