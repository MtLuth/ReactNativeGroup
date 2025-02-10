import authService from "../service/authService.js";
import catchAsync from "../utils/catchAsync.js";

class AuthController {
  register = catchAsync(async (req, res, next) => {
    const { email, password, confirmPassword, fullName } = req.body;
    const savedUser = await authService.register(
      email,
      password,
      confirmPassword,
      fullName
    );
    res.status(201).json({
      status: "success",
      data: savedUser,
    });
  });
}

export default new AuthController();
