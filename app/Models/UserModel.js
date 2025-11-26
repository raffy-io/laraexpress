import db from "../../config/db.js";
export default class UserModel {
  async all() {
    const data = await db.any("SELECT * FROM users");
    return data;
  }

  static all() {
    return new this().all();
  }
}
