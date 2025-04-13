import Category from "../model/category.js";

class categoryService {
  async getAllCategories() {
    try {
      const categories = await Category.find();
      return categories;
    } catch (error) {
      throw new Error("Lỗi khi lấy danh mục: " + error.message);
    }
  }

  async createCategory(name, description) {
    try {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        throw new Error("Danh mục đã tồn tại!");
      }

      const newCategory = new Category({
        name,
        description,
      });

      await newCategory.save();
      return newCategory;
    } catch (error) {
      throw new Error("Lỗi khi tạo danh mục: " + error.message);
    }
  }
}

export default new categoryService();
