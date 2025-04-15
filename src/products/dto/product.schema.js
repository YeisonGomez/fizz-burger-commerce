const { z } = require('zod');

const ProductSchema = z.object({
  name: z.string({
    required_error: "El nombre es requerido",
    invalid_type_error: "El nombre debe ser un texto"
  })
  .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
  .max(100, { message: "El nombre no puede exceder 100 caracteres" })
  .transform(name =>  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()),


  type: z.string({
    required_error: "El tipo es requerido",
    invalid_type_error: "El tipo debe ser un texto"
  })
  .min(2, { message: "El tipo debe tener al menos 2 caracteres" }),


  price: z.number({
    required_error: "El precio es requerido",
    invalid_type_error: "El precio debe ser un número"
  })
  .positive({ message: "El precio debe ser mayor a 0" })
  .max(1000000, { message: "El precio no puede exceder $1,000,000" }),


  image: z.string({
    invalid_type_error: "La imagen debe ser una URL válida"
  })
  .url({ message: "La imagen debe ser una URL válida" })
  .optional(),


  isPromotion: z.boolean({
    invalid_type_error: "isPromotion debe ser un booleano"
  })
  .optional()
  .default(false),


  discount: z.number({
    invalid_type_error: "El descuento debe ser un número"
  })
  .min(0, { message: "El descuento no puede ser negativo" })
  .max(100, { message: "El descuento no puede exceder 100%" })
  .optional()
  .default(0),


  ingredients: z.array(
    z.string({
      invalid_type_error: "Cada ingrediente debe ser un texto"
    }),
    {
      required_error: "Los ingredientes son requeridos",
      invalid_type_error: "Los ingredientes deben ser un array"
    }
  )
  .nonempty({ message: "Debe haber al menos un ingrediente" })
  .max(50, { message: "No puede haber más de 50 ingredientes" })
});

module.exports.ProductSchema = ProductSchema;