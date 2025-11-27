import BaseModel from "../Core/model/BaseModel.js";

class Product extends BaseModel {
  constructor() {
    super("products"); // table name
  }

  static table = "products";
}

export default Product;
