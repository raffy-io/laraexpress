import db from "../../../config/db.js";
import { Queries } from "../queries/queries.js";

export default class BaseModel {
  constructor(table) {
    this.table = table;
  }

  all() {
    return db.any(Queries.all(this.table));
  }

  find(id) {
    return db.oneOrNone(Queries.find(this.table)(id));
  }

  create(data) {
    return db.one(Queries.create(this.table, data));
  }

  update(id, data) {
    return db.one(Queries.update(this.table, id, data));
  }

  delete(id) {
    return db.none(Queries.delete(this.table, id));
  }

  softDelete(id) {
    return db.one(Queries.softDelete(this.table, id));
  }

  paginate(page = 1, perPage = 10) {
    return db.any(Queries.paginate(this.table, page, perPage));
  }

  static create(data) {
    return new this().create(data);
  }
}
