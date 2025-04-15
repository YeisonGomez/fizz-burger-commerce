const ApiResponse = require("../@utils/ApiResponse");
const { connectToDatabase } = require("../database");
const { ObjectId } = require("mongodb");
const ProductModel = require("./models/product");

const apiResponse = new ApiResponse();

module.exports.handler = async (event, context) => {
  const productId = event.pathParameters.id;

  try {
    await connectToDatabase();

    const product = await ProductModel.findOne({
      _id: ObjectId.createFromHexString(productId),
    });

    if (!product)
      return apiResponse.error(404, {
        key: "product_not_exists",
        message: "Product not found",
      });

    return apiResponse.success(200, product);
  } catch (error) {
    return apiResponse.error(500, {
      key: "internal_server_error",
      message: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
