import categoryService from "../service/categoryService.js";
import catchAsync from "../utils/catchAsync.js";

class CategoryController {
  getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      status: "success",
      data: categories,
    });
  });

  createCategory = catchAsync(async (req, res, next) => {
    const { name, imageUrl, description } = req.body;
    const newCategory = await categoryService.createCategory(
      name,
      imageUrl,
      description
    );
    res.status(201).json({
      status: "success",
      data: newCategory,
    });
  });
}

export default new CategoryController();
