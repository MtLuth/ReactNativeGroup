import Product from "../model/product.js";

class ProductService {
  async getAllProducts(page = 1, limit = 6, search = "") {
    try {
      const skip = (page - 1) * limit;

      const query = search
        ? { name: { $regex: search, $options: "i" } } // tìm kiếm không phân biệt hoa thường
        : {};

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
}

export default new ProductService();
