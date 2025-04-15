const { z } = require('zod');

const CreateSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  })
  .min(2, { message: "Name must be at least 2 characters" })
  .max(100, { message: "Name cannot exceed 100 characters" })
  .transform(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()),

  type: z.string({
    required_error: "Type is required",
    invalid_type_error: "Type must be a string"
  })
  .min(2, { message: "Type must be at least 2 characters" }),

  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number"
  })
  .positive({ message: "Price must be greater than 0" }),

  image: z.string({
    invalid_type_error: "Image must be a valid URL"
  })
  .url({ message: "Image must be a valid URL" })
  .optional(),

  isPromotion: z.boolean({
    invalid_type_error: "isPromotion must be a boolean"
  })
  .optional()
  .default(false),

  discount: z.number({
    invalid_type_error: "Discount must be a number"
  })
  .min(0, { message: "Discount cannot be negative" })
  .max(100, { message: "Discount cannot exceed 100%" })
  .optional()
  .default(0),

  ingredients: z.array(
    z.string({
      invalid_type_error: "Each ingredient must be a string"
    }),
    {
      required_error: "Ingredients are required",
      invalid_type_error: "Ingredients must be an array"
    }
  )
  .nonempty({ message: "There must be at least one ingredient" })
  .max(50, { message: "Cannot have more than 50 ingredients" })
});

module.exports.CreateSchema = CreateSchema;