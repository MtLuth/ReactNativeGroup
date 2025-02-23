import cloudinary from "../config/cloudinaryConfig.js";
import * as fs from "fs";

class MediaService {
  async uploadImage(file) {
    try {
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: "user_avatars",
        public_id: file.filename,
        resource_type: "auto",
      });

      fs.unlinkSync(file.path);

      return result.secure_url;
    } catch (error) {
      throw new Error("Error uploading image to Cloudinary: " + error.message);
    }
  }
}

export default new MediaService();
