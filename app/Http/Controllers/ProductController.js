import BaseController from "../../Core/controller/BaseController.js";
import Product from "../../Models/Product.js";

export default class ProductController extends BaseController {
  async index() {
    const products = await Product.all();
    return this.view("products/index", { products });
  }
  async show() {
    const product = await Product.find(Number(this.req.params.id));

    if (!product) {
      return this.view("errors/error", {
        code: 404,
        title: "Not Found",
        message: "Product not found or might be deleted..",
        backUrl: "/products",
        backMessage: "Go Back",
      });
    }

    return this.view("products/show", { product });
  }

  create() {
    this.view("products/create");
  }

  async store() {
    try {
      // Always validate
      const data = await this.validate({
        product_name: "required|min:3",
        product_price: "required|numeric",
      });

      // Your store logic
      await Product.create({
        product_name: data.product_name,
        product_price: data.product_price,
      });

      // Redirect user
      return this.redirect("/products");
    } catch (error) {
      // return to form with old values and errors
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
