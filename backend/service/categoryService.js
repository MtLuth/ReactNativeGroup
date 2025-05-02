import Category from "../model/category.js";

class CategoryService {
  async getAllCategories(page = 1, limit = 10, search = "") {
    const skip = (page - 1) * limit;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query).skip(skip).limit(limit),
    ]);

    return {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      categories,
    };
  }

  async createCategory(name, imageUrl, description) {
    if (await Category.findOne({ name })) {
      throw new Error("Danh mục đã tồn tại!");
    }
    const cat = new Category({ name, imageUrl, description });
    await cat.save();
    return cat;
  }

  async updateCategory(id, payload) {
    const updated = await Category.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updated) throw new Error("Không tìm thấy danh mục");
    return updated;
  }

  async deleteCategory(id) {
    const removed = await Category.findByIdAndDelete(id);
    if (!removed) throw new Error("Không tìm thấy danh mục để xoá");
    return true;
  }
}

export default new CategoryService();
