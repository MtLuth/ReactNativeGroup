import Product from "../model/product.js";

class ProductService {
  async getAllProducts(page = 1, limit = 6, search = "", category = "") {
    try {
      const skip = (page - 1) * limit;

      // Xây dựng query tìm kiếm
      const query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (category) {
        query.category = category; // Lọc theo _id của category
      }

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .populate("category")
        .skip(skip)
        .limit(limit);

      return {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        products,
      };
    } catch (error) {
      throw new Error("Lỗi khi lấy danh sách sản phẩm: " + error.message);
    }
  }

  async createProduct(name, price, imageUrl, description, category) {
    try {
      const newProduct = new Product({
        name,
        price,
        imageUrl,
        description,
        category,
      });
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("Lỗi khi tạo sản phẩm: " + error.message);
    }
  }

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }
      return product;
    } catch (error) {
      throw new Error("Lỗi khi lấy sản phẩm theo ID: " + error.message);
    }
  }
}

export default new ProductService();
