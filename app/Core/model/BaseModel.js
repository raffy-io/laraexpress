import db from "../../../config/db.js";

const allowedTables = ["welcome", "users", "products"]; // whitelist

export default class BaseModel {
  constructor(table) {
    if (!allowedTables.includes(table)) {
      throw new Error(`Invalid table name: ${table}`);
    }
    this.table = table;
  }

  all() {
    return db.any(`SELECT * FROM ${this.table}`);
  }

  find(id) {
    return db.oneOrNone(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
  }

  create(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    const query = `INSERT INTO ${this.table} (${columns.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;
    return db.one(query, values);
  }

  async update(id, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const sets = columns.map((col, i) => `${col} = $${i + 1}`);

    // Add id as last parameter
    values.push(id);

    const query = `
    UPDATE ${this.table}
    SET ${sets.join(",")}
    WHERE id = $${values.length}
  `;

    return db.none(query, values);
  }

  delete(id) {
    return db.none(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
  }

  static all() {
    return new this().all();
  }

  static find(id) {
    return new this().find(id);
  }

  static create(data) {
    return new this().create(data);
  }

  static delete(id) {
    return new this().delete(id);
  }

  static update(id, data) {
    return new this().update(id, data);
  }
}
