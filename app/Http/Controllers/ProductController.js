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
  store() {
    dd(this.req.body, this.res);
  }
  update() {
    this.send("Update method");
  }
  destroy() {
    this.send("Destroy method");
  }
}
