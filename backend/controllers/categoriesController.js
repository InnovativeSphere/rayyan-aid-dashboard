import db from "../../pages/lib/db";

const CategoriesController = {
  // CREATE a new category
  createCategory: async ({ name, description }) => {
    const sql = `
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `;
    const [result] = await db.execute(sql, [name, description]);
    return result.insertId;
  },

  // READ all categories
  getAllCategories: async () => {
    const [rows] = await db.execute(
      "SELECT id, name, description, created_at, updated_at FROM categories",
    );
    return rows;
  },

  // READ single category by ID
  getCategoryById: async (id) => {
    const [rows] = await db.execute(
      "SELECT id, name, description, created_at, updated_at FROM categories WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  // UPDATE category by ID
  updateCategory: async (id, { name, description }) => {
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }

    if (fields.length === 0) return null; // nothing to update

    const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  },

  // DELETE category by ID with safety check
  deleteCategory: async (id) => {
    // First, check if any projects are using this category
    const [projects] = await db.execute(
      "SELECT id FROM projects WHERE category_id = ?",
      [id],
    );

    if (projects.length > 0) {
      // Return 0 or throw an error; here we return 0 to indicate nothing deleted
      return 0;
    }

    // Safe to delete
    const [result] = await db.execute("DELETE FROM categories WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  },
};

export default CategoriesController;
