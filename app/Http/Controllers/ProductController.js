import BaseController from "../../Core/controller/BaseController.js";
import Product from "../../Models/Product.js";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

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
      // 1. Always validate text inputs first
      const data = await this.validate({
        product_image: "image",
        product_name: "required|min:3",
        product_price: "required|numeric",
      });

      // 2. Access uploaded file safely
      const file = this.req.files?.[0] || null;

      // 3. Save file only when exists
      if (file) {
        const filename =
          file.fieldname + "-" + nanoid() + "-" + file.originalname;

        const uploadPath = path.join(process.cwd(), "public/uploads", filename);

        // Write to disk (manually)
        fs.writeFileSync(uploadPath, file.buffer);

        // Store public path in DB
        data.product_image = "/uploads/" + filename;
      }

      // 4. Just log the final data
      console.log(data);

      // 5. Insert into DB
      await Product.create(data);

      // 6. Redirect
      return this.redirect("/products");
    } catch (error) {
      return this.view("products/create", {
        old: this.req.body,
        error: error.validation,
      });
      // console.log("❌ CATCH ERROR:", error);
      // throw error;
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
        product_image: "image",
        product_name: "required|min:3",
        product_price: "required|numeric",
      });

      // 2. Access uploaded file safely
      const file = this.req.files?.[0] || null;

      // 3. Save file only when exists
      if (file) {
        const filename =
          file.fieldname + "-" + nanoid() + "-" + file.originalname;

        const uploadPath = path.join(process.cwd(), "public/uploads", filename);

        // Write to disk (manually)
        fs.writeFileSync(uploadPath, file.buffer);

        // Store public path in DB
        data.product_image = "/uploads/" + filename;
      }

      // Your update logic
      Product.update(id, data);

      // Redirect user
      return this.redirect("/products");
    } catch (error) {
      // return to form with old values and errors
      return this.view("products/create", {
        old: this.req.body,
        error: error.validation,
      });
      // console.log("❌ CATCH ERROR:", error);
      // throw error;
    }
  }

  async destroy() {
    const id = Number(this.req.params.id);
    await Product.delete(id);
    return this.redirect("/products");
  }
}
