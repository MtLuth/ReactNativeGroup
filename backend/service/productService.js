import Order from "../model/order.js";
import Product from "../model/product.js";
import Review from "../model/review.js";
import mongoose from 'mongoose';
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

      let results = [];
      for (let product of products) {
        let reviews = await Review.find({ product: product._id });
        let totalRating = 0;
        let totalReviews = 0;
        reviews.forEach((review) => {
          totalRating += review.rating;
          totalReviews++;
        });
        let averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        const orders = await Order.find({
          status: { $ne: "Canceled" },
          "items.product": product._id,
        });

        results.push({
          ...product._doc,
          averageRating: averageRating,
          totalReviews: totalReviews,
          totalOrders: orders.length,
        });
      }

      return {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        products: results,
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
      const reviews = await Review.find({ product: productId }).populate(
        "user",
        "fullName avatar"
      );
      let totalRating = 0;
      let totalReviews = 0;
      reviews.forEach((review) => {
        totalRating += review.rating;
        totalReviews++;
      });
      let averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
      const orders = await Order.find({
        status: { $ne: "Canceled" },
        "items.product": productId,
      });
      product._doc.averageRating = averageRating;
      product._doc.totalReviews = totalReviews;
      product._doc.totalOrders = orders.length;
      product._doc.reviews = reviews;
      return product;
    } catch (error) {
      throw new Error("Lỗi khi lấy sản phẩm theo ID: " + error.message);
    }
  }
  async updateProduct(id, payload) {
    const updated = await Product.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new Error('Không tìm thấy sản phẩm để cập nhật');
    return updated;
  }

  async deleteProduct(id) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const removed = await Product.findByIdAndDelete(id, { session });
      if (!removed) throw new Error('Không tìm thấy sản phẩm để xoá');

      await Review.deleteMany({ product: id }).session(session);

      await Order.updateMany(
          { 'items.product': id },
          { $pull: { items: { product: id } } },
          { session },
      );

      await session.commitTransaction();
      return removed;
    } catch (err) {
      await session.abortTransaction();
      throw new Error('Lỗi khi xoá sản phẩm: ' + err.message);
    } finally {
      session.endSession();
    }
  }
}

export default new ProductService();
