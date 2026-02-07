import db from "../../pages/lib/db";

const ProjectsController = {
  // CREATE a new project
  createProject: async ({
    title,
    description,
    start_date,
    end_date,
    category_id,
    target_donation,
  }) => {
    const sql = `
      INSERT INTO projects 
      (title, description, start_date, end_date, category_id, target_donation)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      title,
      description,
      start_date,
      end_date,
      category_id || null,
      target_donation || null,
    ]);

    return result.insertId;
  },

  // READ all projects
  getAllProjects: async () => {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.start_date,
        p.end_date,
        p.created_at,
        p.updated_at,
        p.category_id,
        p.target_donation,
        c.name AS category_name
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
    `);

    return rows;
  },

  // READ single project
  getProjectById: async (id) => {
    const [rows] = await db.execute(
      `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.start_date,
        p.end_date,
        p.created_at,
        p.updated_at,
        p.category_id,
        p.target_donation,
        c.name AS category_name
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
      `,
      [id],
    );

    return rows[0] || null;
  },

  // UPDATE project
  updateProject: async (
    id,
    { title, description, start_date, end_date, category_id, target_donation },
  ) => {
    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }

    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }

    if (start_date !== undefined) {
      fields.push("start_date = ?");
      values.push(start_date);
    }

    if (end_date !== undefined) {
      fields.push("end_date = ?");
      values.push(end_date);
    }

    if (category_id !== undefined) {
      fields.push("category_id = ?");
      values.push(category_id);
    }

    if (target_donation !== undefined) {
      fields.push("target_donation = ?");
      values.push(target_donation);
    }

    if (fields.length === 0) return null;

    const sql = `
      UPDATE projects 
      SET ${fields.join(", ")} 
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await db.execute(sql, values);

    // If MySQL says 0 rows affected, check if project exists
    if (result.affectedRows === 0) {
      const [check] = await db.execute("SELECT id FROM projects WHERE id = ?", [
        id,
      ]);

      if (check.length > 0) {
        return 1; // project exists, nothing changed
      }

      return 0; // truly not found
    }

    return result.affectedRows;
  },

  // DELETE project
  deleteProject: async (id) => {
    const [result] = await db.execute("DELETE FROM projects WHERE id = ?", [
      id,
    ]);

    return result.affectedRows;
  },
};

export default ProjectsController;
