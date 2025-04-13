const paginationMiddleware = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const limit = parseInt(req.query.limit) || 10; // Số mục mỗi trang

    const startIndex = (page - 1) * limit;

    try {
      const total = await model.countDocuments();
      const results = await model.find().skip(startIndex).limit(limit);

      req.results = {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: results,
      };

      next();
    } catch (err) {
      res.status(500).json({ message: "Lỗi phân trang", error: err.message });
    }
  };
};

export default paginationMiddleware;
