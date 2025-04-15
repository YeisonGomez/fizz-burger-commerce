const { connectToDatabase } = require("../@common/mongoDB/database");
const ApiResponse = require("../@utils/ApiResponse");
const { BaseDto } = require("../@utils/BaseDto");
const ProductModel = require("./models/product");
const { ProductSchema } = require("./dto/product.schema");

const apiResponse = new ApiResponse();

module.exports.handler = async (event, context) => {
  try {
    if (["POST"].includes(event.httpMethod)) {
      const body = JSON.parse(event.body || "{}");
      const productData = new BaseDto(ProductSchema, body).validate();

      await connectToDatabase();

      const newProduct = await ProductModel.create(productData);

      return apiResponse.success(201, {
        message: "Product created successfully",
        product: newProduct,
      });
    }
  } catch (error) {
    if (error instanceof ApiResponse) return error.toResponse();

    return apiResponse.error(500, {
      key: "internal_server_error",
      message: "Internal server error",
      details: error,
    });
  }
};
