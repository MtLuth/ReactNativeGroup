import categoryService from '../service/categoryService.js';
import catchAsync from '../utils/catchAsync.js';

class CategoryController {
  getAllCategories = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const data = await categoryService.getAllCategories(+page, +limit, search);
    res.status(200).json({ status: 'success', data });
  });

  createCategory = catchAsync(async (req, res) => {
    const { name, imageUrl, description } = req.body;
    const newCat = await categoryService.createCategory(name, imageUrl, description);
    res.status(201).json({ status: 'success', data: newCat });
  });

  updateCategory = catchAsync(async (req, res) => {
    const updated = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: updated });
  });

  deleteCategory = catchAsync(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  });
}

export default new CategoryController();
