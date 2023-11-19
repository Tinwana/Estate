import argon2 from "argon2";
import User from "../models/user.model.js";
class userController {
  async updateUser(req, res, next) {
    const userId = req.params.userId;
    try {
      const user = await User.findOne({ _id: userId });
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "user di param is required!",
        });
      } else if (user === null) {
        return res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const hash =
          req.body.password === ""
            ? user.password
            : await argon2.hash(req.body.password);
        const updateUser = await User.findOneAndUpdate(
          { _id: userId },
          {
            name: req.body.name,
            age: req.body.age,
            address: req.body.address,
            email: req.body.email,
            username: req.body.username,
            password: hash,
            avatar: req.body.avatar,
          },
          {
            new: true,
          }
        );
        const { password, ...rest } = updateUser._doc;
        return res.status(200).json({
          status: "OK",
          message: "User has update!",
          data: rest,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async deleteUser(req, res, next) {
    const userId = req.params.userId;
    try {
      const user = await User.findOne({ _id: userId });
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "user di param is required!",
        });
      } else if (user === null) {
        return res.status(404).json({
          status: "error",
          message: "User not found!",
        });
      } else {
        const deleteUser = await User.findByIdAndDelete(userId, { new: true });
        return res.status(200).json({
          status: "OK",
          message: "User has delete!",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new userController();
