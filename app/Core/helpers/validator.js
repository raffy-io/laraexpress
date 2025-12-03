import { body, validationResult } from "express-validator";

const validate = async (req, rules, defaultValues = {}) => {
  const validators = [];

  const pretty = (field) =>
    field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  for (const field in rules) {
    const fieldRules = rules[field].split("|");

    for (const rule of fieldRules) {
      if (rule === "required") {
        validators.push(
          body(field)
            .exists({ checkFalsy: true })
            .withMessage(`${pretty(field)} is required.`)
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
            .withMessage(`${pretty(field)} must be at least ${min} characters`)
        );
      }

      if (rule.startsWith("max:")) {
        const max = parseInt(rule.split(":")[1]);
        validators.push(
          body(field)
            .isLength({ max })
            .withMessage(`${pretty(field)} must not exceed ${max} characters`)
        );
      }

      if (rule === "string") {
        validators.push(
          body(field)
            .isString()
            .withMessage(`${pretty(field)} must be a string`)
        );
      }

      if (rule === "numeric") {
        validators.push(
          body(field)
            .isNumeric()
            .withMessage(`${pretty(field)} must be numeric`)
        );
      }

      if (rule === "integer") {
        validators.push(
          body(field)
            .isInt()
            .withMessage(`${pretty(field)} must be an integer`)
        );
      }

      if (rule === "email") {
        validators.push(
          body(field).isEmail().withMessage("Invalid email format")
        );
      }

      if (rule === "confirmed") {
        validators.push(
          body(field).custom((value, { req }) => {
            const confirmation = req.body[`${field}_confirmation`];
            if (value !== confirmation) {
              throw new Error(`${pretty(field)} does not match confirmation`);
            }
            return true;
          })
        );
      }

      if (rule === "image") {
        validators.push(
          body(field).custom((value, { req }) => {
            const allowed = [
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/gif",
              "image/jpg",
            ];

            const image = req.files ? req.files[0] : null;

            if (!image) {
              throw new Error(`${pretty(field)} is required`);
            }

            if (!allowed.includes(image.mimetype)) {
              throw new Error(
                `${pretty(
                  field
                )} must be valid image type (jpg, jpeg, png, webp, gif)`
              );
            }

            // ✅ Explicitly return true if validation passes
            return true;
          })
        );
      }
    }
  }

  // Run validators
  for (const v of validators) {
    await v.run(req);
  }

  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error("Validation failed");
    error.status = 422;
    error.validation = result.mapped();
    throw error;
  }

  // Return validated data
  const validatedData = {};
  for (const field in rules) {
    validatedData[field] = req.body[field] ?? defaultValues[field] ?? null;
  }

  return validatedData;
};

export default validate;
