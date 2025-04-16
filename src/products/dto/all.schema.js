const { z } = require('zod');
const { PRODUCT_TYPES } = require('../constansts/product.constanst');

const ORDER_FIELDS = ['name', 'price', 'type', 'discount'];
const ORDER_DIRECTIONS = ['asc', 'desc'];

const AllSchema = z.object({
  name: z.string({
    invalid_type_error: "Name filter must be a string"
  })
  .optional(),

  type: z.string({
    invalid_type_error: "Type filter must be a string"
  })
  .refine(value => !value || PRODUCT_TYPES.includes(value.toLowerCase()), {
    message: `Type must be one of: ${PRODUCT_TYPES.join(', ')}`
  })
  .transform(value => value?.toLowerCase())
  .optional(),

  priceFrom: z.union([
    z.string().regex(/^\d+\.?\d*$/, "Must be a valid number").transform(Number),
    z.number()
  ])
  .refine(value => value >= 0, {
    message: "PriceFrom must be positive"
  })
  .optional(),

  priceTo: z.union([
    z.string().regex(/^\d+\.?\d*$/, "Must be a valid number").transform(Number),
    z.number()
  ])
  .refine(value => value >= 0, {
    message: "PriceTo must be positive"
  })
  .optional(),

  isPromotion: z.union([
    z.enum(['0', '1']).transform(val => val === '1'),
    z.boolean()
  ], {
    invalid_type_error: "isPromotion must be 0, 1 or boolean"
  })
  .optional(),

  orderBy: z.string({
    invalid_type_error: "orderBy must be a string"
  })
  .refine(value => ORDER_FIELDS.includes(value), {
    message: `orderBy must be one of: ${ORDER_FIELDS.join(', ')}`
  })
  .default('name'),

  orderDirection: z.string({
    invalid_type_error: "orderDirection must be a string"
  })
  .refine(value => ORDER_DIRECTIONS.includes(value.toLowerCase()), {
    message: `orderDirection must be one of: ${ORDER_DIRECTIONS.join(', ')}`
  })
  .transform(value => value.toLowerCase())
  .default('asc')
  
}).refine(data => {
  if (data.priceFrom && data.priceTo) {
    return data.priceFrom <= data.priceTo;
  }
  return true;
}, {
  message: "priceFrom must be less than or equal to priceTo",
  path: ['priceValidation']
});

const validateProductFilters = (filters) => {
  return AllSchema.parse(filters);
};

module.exports = {
  AllSchema,
  validateProductFilters,
  ORDER_FIELDS,
  ORDER_DIRECTIONS
};