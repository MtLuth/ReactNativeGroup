import Review from "../model/review.js";
import productService from "../service/productService.js";
import catchAsync from "../utils/catchAsync.js";

class ProductController {
  getAllProducts = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const category = req.query.category || "";

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";

    const products = await productService.getAllProducts(
      page,
      limit,
      search,
      category,
      sortBy,
      sortOrder
    );

    res.status(200).json({
      status: "success",
      data: products,
    });
  });

  createProduct = catchAsync(async (req, res, next) => {
    const { name, price, imageUrl, description, category, salePrice } =
      req.body;

    const newProduct = await productService.createProduct(
      name,
      price,
      imageUrl,
      description,
      category,
      salePrice
    );

    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  });

  getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    res.status(200).json({
      status: "success",
      data: product,
    });
  });

  updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updated = await productService.updateProduct(id, req.body);
    res.status(200).json({ status: "success", data: updated });
  });

  deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(204).json({ status: "success", data: null });
  });
}

export default new ProductController();
