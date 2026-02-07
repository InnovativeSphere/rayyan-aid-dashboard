import CategoriesController from "../../../backend/controllers/categoriesController";
import { verifyToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      // GET /api/categories - fetch all or single by ID
      case "GET": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.query;

        if (id) {
          const category = await CategoriesController.getCategoryById(id);
          if (!category)
            return res.status(404).json({ error: "Category not found" });
          return res.status(200).json(category);
        }

        const categories = await CategoriesController.getAllCategories();
        return res.status(200).json(categories);
      }

      // POST /api/categories - create new category
      case "POST": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { name, description } = req.body;
        if (!name)
          return res.status(400).json({ error: "Category name is required" });

        const newId = await CategoriesController.createCategory({
          name,
          description,
        });
        return res.status(201).json({ message: "Category created", id: newId });
      }

      // PUT /api/categories - update category
      case "PUT": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id, name, description } = req.body;
        if (!id)
          return res.status(400).json({ error: "Category ID is required" });

        const updated = await CategoriesController.updateCategory(id, {
          name,
          description,
        });
        if (!updated)
          return res
            .status(404)
            .json({ error: "Category not found or nothing to update" });

        return res
          .status(200)
          .json({ message: "Category updated", affectedRows: updated });
      }

      // DELETE /api/categories - remove category
      case "DELETE": {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.body;
        if (!id)
          return res.status(400).json({ error: "Category ID is required" });

        const deleted = await CategoriesController.deleteCategory(id);
        if (!deleted)
          return res
            .status(400)
            .json({ error: "Category not deleted. It may be linked to projects." });

        return res
          .status(200)
          .json({ message: "Category deleted", affectedRows: deleted });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
