const { z } = require('zod');

const UpdateSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  })
  .min(2, { message: "Name must be at least 2 characters" })
  .max(100, { message: "Name cannot exceed 100 characters" })
  .transform(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
  .optional(),

  type: z.string({
    required_error: "Type is required",
    invalid_type_error: "Type must be a string"
  })
  .min(2, { message: "Type must be at least 2 characters" })
  .optional(),

  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number"
  })
  .positive({ message: "Price must be greater than 0" })
  .optional(),

  image: z.string({
    invalid_type_error: "Image must be a valid URL"
  })
  .url({ message: "Image must be a valid URL" })
  .optional(),

  isPromotion: z.boolean({
    invalid_type_error: "isPromotion must be a boolean"
  })
  .optional(),

  discount: z.number({
    invalid_type_error: "Discount must be a number"
  })
  .min(0, { message: "Discount cannot be negative" })
  .max(100, { message: "Discount cannot exceed 100%" })
  .optional(),

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
  .optional(),

  
  status: z.string({
    invalid_type_error: "Status must be a string"
  })
  .refine(
    value => value === 'active' || value === 'inactive', 
    {
      message: "Status must be either 'active' or 'inactive'"
    }
  )
  .optional()
});

module.exports.UpdateSchema = UpdateSchema;