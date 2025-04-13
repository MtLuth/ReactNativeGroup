import productService from "../service/productService.js";
import catchAsync from "../utils/catchAsync.js";

class ProductController {
  // Lấy danh sách sản phẩm với phân trang và tìm kiếm
  getAllProducts = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const products = await productService.getAllProducts(page, limit, search);

    res.status(200).json({
      status: "success",
      data: products,
    });
  });

  // Tạo sản phẩm mới
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
