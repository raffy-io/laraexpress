import BaseController from "../../Core/controller/BaseController.js";

export default class ProductController extends BaseController {
  index() {
    this.view("products/index");
  }
  show() {
    this.send("Show method");
  }
  create() {
    this.view("products/create");
  }
  async store() {
    try {
      const data = await this.validate({
        product_name: "required|min:3",
        product_price: "required",
      });

      this.dd(data);
    } catch (error) {
      return this.view("products/create", {
        old: this.req.body,
        error: error.validation,
      });
    }
  }
  update() {
    this.send("Update method");
  }
  destroy() {
    this.send("Destroy method");
  }
}
