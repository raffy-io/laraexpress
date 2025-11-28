import { body, validationResult } from "express-validator";

export default class BaseController {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  async view(template, data = {}) {
    try {
      return this.res.render(template, data);
    } catch (error) {
      this.next(error);
    }
  }

  async send(data) {
    try {
      return this.res.send(data);
    } catch (error) {
      this.next(error);
    }
  }

  async json(data) {
    try {
      return this.res.json(data);
    } catch (error) {
      this.next(error);
    }
  }

  status(code) {
    this.res.status(code);
    return this;
  }

  redirect(url) {
    return this.res.redirect(url);
  }

  abort(code = 404, message = "Not Found") {
    return this.res.status(code).send(message);
  }

  dd(data) {
    return global.dd(this.res, data);
  }

  async validate(rules) {
    const validators = [];

    for (const field in rules) {
      const fieldRules = rules[field].split("|");

      for (const rule of fieldRules) {
        if (rule === "required") {
          validators.push(
            body(field)
              .exists({ checkFalsy: true })
              .withMessage(`${this.pretty(field)} is required.`)
              .bail()
              .trim()
              .escape()
          );
        }
        if (rule.startsWith("min:")) {
          const min = parseInt(rule.split(":")[1]);
          validators.push(
            body(field)
              .isLength({ min })
              .withMessage(
                `${this.pretty(field)} must be at least ${min} characters`
              )
              .trim()
              .escape()
          );
        }
        if (rule === "email") {
          validators.push(
            body(field).isEmail().withMessage("Invalid email format").trim()
          );
        }
        if (rule === "confirmed") {
          validators.push(
            body(field).custom((value, { req }) => {
              if (value !== req.body[confirmField]) {
                throw new Error(
                  `${this.pretty(field)} does not match confirmation`
                );
              }
              return true;
            })
          );
        }
      }
    }

    // Run all validators against the current request
    for (const v of validators) {
      await v.run(this.req);
    }

    const result = validationResult(this.req);

    if (!result.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 422;
      error.validation = result.mapped();
      throw error;
    }

    // Return **typed validated data**
    const validatedData = {};
    for (const field in rules) {
      validatedData[field] =
        this.req.body[field] ?? defaultValues[field] ?? null;
    }

    return validatedData;
  }

  // helper to prettify field names
  pretty(field) {
    return field.replace(/_/g, " ").toUpperCase();
  }
}
