const { connectToDatabase } = require("../@common/mongoDB/database");
const ApiResponse = require("../@utils/ApiResponse");
const ProductModel = require("./models/product");
const { BaseDto } = require("../@utils/BaseDto");
const { AllSchema } = require("./dto/all.schema");

const apiResponse = new ApiResponse();

module.exports.handler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters || {};

    const { name, type, priceFrom, priceTo, isPromotion, orderBy, orderDirection } = new BaseDto(AllSchema, queryParams).validate();

    await connectToDatabase();

    const query = {};
    
    if (name) query.name = { $regex: name, $options: "i" };
    if (type) query.type = type;
    if (isPromotion !== undefined) query.isPromotion = isPromotion;

    if (priceFrom || priceTo) {
      query.price = {};
      if (priceFrom) query.price.$gte = parseFloat(priceFrom);
      if (priceTo) query.price.$lte = parseFloat(priceTo);
    }

    const sort = {};
    sort[orderBy] = orderDirection.toLowerCase() === "asc" ? 1 : -1;
    
    const products = await ProductModel.find(query).sort(sort).lean();

    return apiResponse.success(200, products);
  } catch (error) {
    if (error instanceof ApiResponse) return error.toResponse();

    return apiResponse.error(500, {
      key: "internal_server_error",
      message: "Internal server error",
      details: error,
    });
  }
};
