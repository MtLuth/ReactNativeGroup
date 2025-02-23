import mediaService from "../service/mediaService.js";
import catchAsync from "../utils/catchAsync.js";

class MediaController {
  uploadImage = catchAsync(async (req, res, next) => {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ status: "error", message: "No file uploaded" });
    }

    const imageUrl = await mediaService.uploadImage(file);

    res.status(200).json({
      status: "success",
      message: "Tải ảnh lên Cloudinary thành công.",
      imageUrl,
    });
  });
}

export default new MediaController();
