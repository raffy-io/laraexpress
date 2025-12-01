import BaseController from "../../Core/controller/BaseController.js";
import Product from "../../Models/Product.js";

export default class ProductController extends BaseController {
  async index() {
    const products = await Product.all();
    return this.view("products/index", { products });
  }
  async show() {
    const product = await Product.find(Number(this.req.params.id));
    if (!product)
      return this.notFound(
        "Product not found or might be deleted.",
        "/products"
      );
    return this.view("products/show", { product });
  }

  async create() {
    return this.view("products/create");
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

  async edit() {
    const id = Number(this.req.params.id);
    const product = await Product.find(id);
    if (!product)
      return this.notFound(
        "Product not found or might be deleted.",
        "/products"
      );
    return this.view(`products/edit`, { product });
  }

  async update() {
    try {
      const id = Number(this.req.params.id);

      // Always validate
      const data = await this.validate({
        product_name: "required|min:3",
        product_price: "required|numeric",
      });

      // Your update logic
      Product.update(id, {
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

  async destroy() {
    const id = Number(this.req.params.id);
    await Product.delete(id);
    return this.redirect("/products");
  }
}
