const mongoose = require('mongoose');
const { PRODUCT_TYPES, IMAGE_PRODUCT_DEFAULT } = require('../constansts/product.constanst');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [100, "Name cannot exceed 100 characters"],
    trim: true,
    set: (value) => {
      if (typeof value !== 'string') return value;
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  },
  type: {
    type: String,
    required: [true, "Type is required"],
    enum: {
      values: PRODUCT_TYPES,
      message: `Type must be one of: ${PRODUCT_TYPES.join(', ')}`
    }
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0.01, "Price must be greater than 0"]
  },
  image: {
    type: String,
    default: IMAGE_PRODUCT_DEFAULT
  },
  isPromotion: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
    default: 0
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients are required"],
    validate: {
      validator: (v) => v.length > 0 && v.length <= 50,
      message: "There must be between 1 and 50 ingredients"
    }
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: 'Status can only be "active" or "inactive"'
    },
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ProductModel = mongoose.model('Product', productSchema, 'product');

module.exports = ProductModel;