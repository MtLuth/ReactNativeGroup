import productService from "../service/productService.js";
import catchAsync from "../utils/catchAsync.js";

class ProductController {
  getAllProducts = catchAsync(async (req, res, next) => {
    const products = await productService.getAllProducts();
    res.status(200).json({
      status: "success",
      data: products,
    });
  });

  createProduct = catchAsync(async (req, res, next) => {
    const { name, price, imageUrl, description, category } = req.body;
    const newProduct = await productService.createProduct(
      name,
      price,
      imageUrl,
      description,
      category
    );
    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  });
}

export default new ProductController();
