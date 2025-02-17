import Product from "../model/product.js";

class ProductService {
  async getAllProducts() {
    try {
      const products = await Product.find().populate("category");
      return products;
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
