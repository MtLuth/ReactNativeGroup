import userService from "../service/userService.js";
import catchAsync from "../utils/catchAsync.js";

class UserController {
  getUserInformation = catchAsync(async (req, res, next) => {
    const { userId } = req.user;
    const user = await userService.getProfile(userId);
    res.status(200).json({
      status: "success",
      message: user,
    });
  });

  editProfile = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber, avatar } = req.body;

    const updateResponse = await userService.editProfile(
      fullName,
      email,
      phoneNumber,
      id,
      avatar
    );
    res.status(200).json({
      status: "success",
      message: updateResponse.message,
    });
  });
}

export default new UserController();
