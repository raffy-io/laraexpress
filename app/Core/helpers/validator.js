import { body, validationResult } from "express-validator";

/**
 * Validates request data using express-validator
 * Laravel-like validation helper for controllers
 *
 * @param {Object} req - Express request object
 * @param {Object|Array} rules - Validation rules object or express-validator chains array
 * @param {Object} customMessages - Custom error messages
 * @returns {Promise<Object>} Validated data or throws validation error
 *
 * @example
 * // Simple rules object
 * const data = await this.validate(this.req, {
 *   email: "required|email",
 *   password: "required|min:6",
 *   name: "required|string"
 * });
 *
 * // Or use express-validator chains directly
 * const data = await this.validate(this.req, [
 *   body('email').isEmail(),
 *   body('password').isLength({ min: 6 })
 * ]);
 */

const validate = async (req, rules, customMessages = {}) => {
  let validationChains = [];

  // Handle string rules format (Laravel-like)
  if (typeof rules === "object" && !Array.isArray(rules)) {
    validationChains = Object.entries(rules).map(([field, ruleString]) => {
      return parseRules(field, ruleString, customMessages);
    });
  }
  // Handle express-validator chains directly
  else if (Array.isArray(rules)) {
    validationChains = rules;
  }

  // Run all validations
  await Promise.all(validationChains.map((chain) => chain.run(req)));

  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((error) => {
      if (!formattedErrors[error.param]) {
        formattedErrors[error.param] = [];
      }
      formattedErrors[error.param].push(
        customMessages[`${error.param}.${error.msg}`] || error.msg
      );
    });

    const error = new Error("Validation failed");
    error.status = 422;
    error.errors = formattedErrors.mapped();
    throw error;
  }

  // Return validated data from request body
  const validatedData = {};
  if (typeof rules === "object" && !Array.isArray(rules)) {
    Object.keys(rules).forEach((field) => {
      validatedData[field] = req.body[field];
    });
  } else if (Array.isArray(rules)) {
    // Extract field names from validation chains
    rules.forEach((chain) => {
      if (chain.builder && chain.builder.fields) {
        chain.builder.fields.forEach((field) => {
          validatedData[field] = req.body[field];
        });
      }
    });
  }

  return validatedData;
};

/**
 * Parse Laravel-like rule strings and return express-validator chain
 * Supports: required, email, min:6, max:20, string, numeric, etc.
 */
const parseRules = (field, ruleString, customMessages = {}) => {
  let chain = body(field);
  const rules = ruleString.split("|").map((r) => r.trim());

  rules.forEach((rule) => {
    const [validator, ...params] = rule.split(":");

    switch (validator) {
      case "required":
        chain = chain
          .notEmpty()
          .withMessage(
            customMessages[`${field}.required`] || `${field} is required`
          );
        break;

      case "email":
        chain = chain
          .isEmail()
          .withMessage(
            customMessages[`${field}.email`] || `${field} must be a valid email`
          );
        break;

      case "min":
        const minLength = parseInt(params[0]);
        chain = chain
          .isLength({ min: minLength })
          .withMessage(
            customMessages[`${field}.min`] ||
              `${field} must be at least ${minLength} characters`
          );
        break;

      case "max":
        const maxLength = parseInt(params[0]);
        chain = chain
          .isLength({ max: maxLength })
          .withMessage(
            customMessages[`${field}.max`] ||
              `${field} must not exceed ${maxLength} characters`
          );
        break;

      case "string":
        chain = chain
          .isString()
          .withMessage(
            customMessages[`${field}.string`] || `${field} must be a string`
          );
        break;

      case "numeric":
        chain = chain
          .isNumeric()
          .withMessage(
            customMessages[`${field}.numeric`] || `${field} must be numeric`
          );
        break;

      case "integer":
      case "int":
        chain = chain
          .isInt()
          .withMessage(
            customMessages[`${field}.integer`] || `${field} must be an integer`
          );
        break;

      case "regex":
        const pattern = params.join(":");
        chain = chain
          .matches(new RegExp(pattern))
          .withMessage(
            customMessages[`${field}.regex`] || `${field} format is invalid`
          );
        break;

      case "unique":
        // Can be extended for database unique validation
        break;

      case "confirmed":
        chain = chain.custom((value, { req }) => {
          if (value !== req.body[`${field}_confirmation`]) {
            throw new Error(`${field} confirmation does not match`);
          }
        });
        break;

      default:
        break;
    }
  });

  return chain;
};

export default validate;
export { body, validationResult };
