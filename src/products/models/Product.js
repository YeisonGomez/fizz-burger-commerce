const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    trim: true,
    set: (value) => {
      if (typeof value !== 'string') return value;
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  },
  type: {
    type: String,
    required: [true, "El tipo es requerido"],
    minlength: [2, "El tipo debe tener al menos 2 caracteres"]
  },
  price: {
    type: Number,
    required: [true, "El precio es requerido"],
    min: [0.01, "El precio debe ser mayor a 0"],
    max: [1000000, "El precio no puede exceder $1,000,000"]
  },
  image: {
    type: String,
    default: null
  },
  isPromotion: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: [0, "El descuento no puede ser negativo"],
    max: [100, "El descuento no puede exceder 100%"],
    default: 0
  },
  ingredients: {
    type: [String],
    required: [true, "Los ingredientes son requeridos"],
    validate: {
      validator: (v) => v.length > 0 && v.length <= 50,
      message: "Debe haber entre 1 y 50 ingredientes"
    }
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