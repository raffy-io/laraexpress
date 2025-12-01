// queries.js
export const Queries = {
  all: (table) => `SELECT * FROM ${table}`,
  find: (table) => (id) =>
    `SELECT * FROM ${table} WHERE id = ${id} AND deleted_at IS NULL`,
  create: (table, data) => {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map((v) => (typeof v === "string" ? `'${v}'` : v))
      .join(", ");
    return `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *`;
  },
  update: (table, id, data) => {
    const setClause = Object.entries(data)
      .map(
        ([key, val]) => `${key}=${typeof val === "string" ? `'${val}'` : val}`
      )
      .join(", ");
    return `UPDATE ${table} SET ${setClause} WHERE id=${id} RETURNING *`;
  },
  delete: (table, id) => `DELETE FROM ${table} WHERE id=${id}`,
  softDelete: (table, id) =>
    `UPDATE ${table} SET deleted_at=NOW() WHERE id=${id} RETURNING *`,
  paginate: (table, page = 1, perPage = 10) => {
    const offset = (page - 1) * perPage;
    return `SELECT * FROM ${table} WHERE deleted_at IS NULL ORDER BY id LIMIT ${perPage} OFFSET ${offset}`;
  },
};
