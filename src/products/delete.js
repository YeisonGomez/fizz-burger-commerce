'use strict';

const { ObjectId } = require('mongodb');

const { connectToDatabase } = require('../@common/mongoDB/database');
const ApiResponse = require('../@utils/ApiResponse');
const ProductModel = require('./models/product');

const apiResponse = new ApiResponse();

module.exports.handler = async event => {

	try {
		const productId = ObjectId.createFromHexString(event.pathParameters.id);

		await connectToDatabase();

		const isDeleted = await ProductModel.findByIdAndDelete(productId);

		if(!isDeleted) {
			return apiResponse.error(404, {
				key: 'product_not_exists',
				message: 'Product not found'
			});
		}

		return apiResponse.success(200, {
			message: 'Product deleted successfully',
			productDeleted: isDeleted
		});
	} catch(error) {

		return apiResponse.error(500, {
			key: 'internal_server_error',
			message: 'Internal server error',
			details: error.message
		});
	}
};
